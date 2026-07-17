package com.spendly.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardSummary(
    BigDecimal totalIncome,
    BigDecimal totalExpense,
    BigDecimal netBalance,
    List<CategorySummary> categoryBreakdown,
    List<MonthlyTrend> monthlyTrend
) {}
