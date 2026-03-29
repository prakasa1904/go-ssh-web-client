import { Terminal } from '@xterm/xterm';
import { AttachAddon } from '@xterm/addon-attach';
import { FitAddon } from '@xterm/addon-fit';

import '@xterm/xterm/css/xterm.css';

const terminal = new Terminal();
const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);
terminal.open(document.getElementById('terminal'));
fitAddon.fit();

const webSocketProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
const webSocket = new WebSocket(
  `${webSocketProtocol + window.location.host}/web-socket/ssh`,
);

const sendSize = () => {
  const windowSize = { high: terminal.rows, width: terminal.cols };
  const blob = new Blob([JSON.stringify(windowSize)], {
    type: 'application/json',
  });
  webSocket.send(blob);
};

const resizeScreen = () => {
  fitAddon.fit();
  sendSize();
};

webSocket.onopen = sendSize;

webSocket.addEventListener('message', (event) => {
  console.log('Received message:', event.data);
});

webSocket.addEventListener('error', (event) => {
  terminal.write(`\r\nWebSocket error: ${event.message}`);
});

webSocket.addEventListener('close', () => {
  terminal.write('\r\nConnection closed by server');
});

window.addEventListener('resize', resizeScreen, false);

const attachAddon = new AttachAddon(webSocket);
terminal.loadAddon(attachAddon);
