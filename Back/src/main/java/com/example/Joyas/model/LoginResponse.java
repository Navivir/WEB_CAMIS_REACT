package com.example.Joyas.model;

public class LoginResponse {
    private String message;
    private String token;
    private int userId;
    private String userName;

    // Constructor para éxito
    public LoginResponse(String message, String token, int userId, String userName) {
        this.message = message;
        this.token = token;
        this.userId = userId;
        this.userName = userName;
    }

    // Constructor para error
    public LoginResponse(String message, int userId, String userName) {
        this.message = message;
        this.userId = userId;
        this.userName = userName;
    }

    // Getters y setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUserName(){
        return userName;
    }
    public void setUserName(String userName){
        this.userName = userName;
    }
}
