package com.spendly.service;

import com.spendly.dto.*;
import com.spendly.entity.Transaction;
import com.spendly.entity.TransactionType;
import com.spendly.entity.User;
import com.spendly.repository.TransactionRepository;
import com.spendly.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public DashboardService(TransactionRepository transactionRepository,
                            UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Get dashboard summary for a given month/year
    public DashboardSummary getSummary(int month, int year) {
        User user = getLoggedInUser();

        // Get total income and expense using JPQL queries
        BigDecimal totalIncome = transactionRepository.sumByTypeAndMonth(user.getId(), TransactionType.INCOME, month, year);
        BigDecimal totalExpense = transactionRepository.sumByTypeAndMonth(user.getId(), TransactionType.EXPENSE, month, year);

        // Category-wise expense breakdown
        List<Object[]> categoryData = transactionRepository.categoryWiseByTypeAndMonth(user.getId(), TransactionType.EXPENSE, month, year);
        List<CategorySummary> categoryBreakdown = new ArrayList<>();
        for (Object[] row : categoryData) {
            categoryBreakdown.add(new CategorySummary(
                (String) row[0],
                (BigDecimal) row[1]
            ));
        }

        // Last 6 months trend
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        List<Object[]> trendData = transactionRepository.monthlyTrend(user.getId(), sixMonthsAgo);
        List<MonthlyTrend> monthlyTrend = buildMonthlyTrend(trendData);

        // Net balance
        BigDecimal netBalance = totalIncome.subtract(totalExpense);

        return new DashboardSummary(
            totalIncome,
            totalExpense,
            netBalance,
            categoryBreakdown,
            monthlyTrend
        );
    }

    // Build monthly trend from raw query results
    private List<MonthlyTrend> buildMonthlyTrend(List<Object[]> trendData) {
        // Group by month+year, accumulate income and expense
        Map<String, BigDecimal[]> trendMap = new HashMap<>();

        for (Object[] row : trendData) {
            int m = ((Number) row[0]).intValue();
            int y = ((Number) row[1]).intValue();
            BigDecimal amount = (BigDecimal) row[2];
            TransactionType type = (TransactionType) row[3];

            String key = y + "-" + m;
            BigDecimal[] values = trendMap.getOrDefault(key, new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO});

            if (type == TransactionType.INCOME) {
                values[0] = values[0].add(amount);
            } else {
                values[1] = values[1].add(amount);
            }
            trendMap.put(key, values);
        }

        // Convert to list, sorted by year and month
        List<MonthlyTrend> result = new ArrayList<>();
        for (Map.Entry<String, BigDecimal[]> entry : trendMap.entrySet()) {
            String[] parts = entry.getKey().split("-");
            int y = Integer.parseInt(parts[0]);
            int m = Integer.parseInt(parts[1]);
            result.add(new MonthlyTrend(m, y, entry.getValue()[0], entry.getValue()[1]));
        }

        result.sort((a, b) -> {
            if (a.year() != b.year()) return Integer.compare(a.year(), b.year());
            return Integer.compare(a.month(), b.month());
        });

        return result;
    }
}
