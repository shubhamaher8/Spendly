package com.spendly.dto;

public record LoginResponse(
    String token,
    String name,
    String email
) {}
