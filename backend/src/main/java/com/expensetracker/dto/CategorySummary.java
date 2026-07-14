package com.expensetracker.dto;

import java.math.BigDecimal;

public record CategorySummary(
    String categoryName,
    BigDecimal totalAmount
) {}
