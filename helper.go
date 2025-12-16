package main

import "os"

func getPort() string {
	httpPort := os.Getenv("PORT")
	if httpPort == "" {
		httpPort = "8080"
	}
	return httpPort
}
