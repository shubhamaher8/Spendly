package com.expensetracker.dto;

import com.expensetracker.entity.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequest(
    @NotNull @Positive BigDecimal amount,
    @NotNull TransactionType type,
    String description,
    @NotNull LocalDate date,
    @NotNull Long categoryId
) {}
