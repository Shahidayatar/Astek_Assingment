package org.example;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.Headers;

public class ExpenseServer {

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8081), 0);
        server.createContext("/apiendpoint", new MyHandler());
        server.start(); // our endpoint is "http://localhost:8081/apiendpoint", we recevied the post on this URL
        System.out.println("Server started on port 8081");
    }

    static class MyHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Set CORS headers to allow requests from any origin,this is impoatnat to allow data to received
            Headers headers = exchange.getResponseHeaders();
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            headers.add("Access-Control-Allow-Headers", "Content-Type");


            String requestBody;
            try (InputStream inputStream = exchange.getRequestBody()) {
                requestBody = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))
                        .lines()
                        .collect(Collectors.joining("\n"));
            }


            System.out.println("Received request body:\n" + requestBody); // we will print the request to console


            String response = "server is running checking the console to see the data recevied front-end :) ";
            exchange.sendResponseHeaders(200, response.getBytes().length);
            try (OutputStream outputStream = exchange.getResponseBody()) {
                outputStream.write(response.getBytes());
            }
        }
    }
}
