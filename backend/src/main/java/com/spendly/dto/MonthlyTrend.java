package com.spendly.dto;

import java.math.BigDecimal;

public record MonthlyTrend(
    int month,
    int year,
    BigDecimal totalIncome,
    BigDecimal totalExpense
) {}
