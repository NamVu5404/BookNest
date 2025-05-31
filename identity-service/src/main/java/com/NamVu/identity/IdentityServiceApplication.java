package com.NamVu.identity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

import io.github.cdimascio.dotenv.Dotenv;

@EnableFeignClients
@SpringBootApplication
public class IdentityServiceApplication {
    public static void main(String[] args) {
        // Load environment variables from .env file
        Dotenv dotenv = Dotenv.configure()
                .directory("D:/MyWorkspace/BookNest/identity-service")
                .load();

        // Đăng ký các biến môi trường vào System
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        SpringApplication.run(IdentityServiceApplication.class, args);
    }
}
