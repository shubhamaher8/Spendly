package com.expensetracker.dto;

public record LoginResponse(
    String token,
    String name,
    String email
) {}
