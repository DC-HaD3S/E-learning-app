package com.example.e_learning.dto;

public class JwtResponse {
    private String jwt;

    // Constructor to accept the JWT token
    public JwtResponse(String jwt) {
        this.jwt = jwt;
    }

    // Getter
    public String getJwt() {
        return jwt;
    }

    // Setter
    public void setJwt(String jwt) {
        this.jwt = jwt;
    }
}