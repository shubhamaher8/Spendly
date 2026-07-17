package com.spendly.dto;

import com.spendly.entity.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TransactionResponse(
    Long id,
    BigDecimal amount,
    TransactionType type,
    String description,
    LocalDate date,
    String categoryName,
    LocalDateTime createdAt
) {}
