package com.expensetracker.repository;

import com.expensetracker.entity.Transaction;
import com.expensetracker.entity.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Find all transactions for a user (paginated, newest first)
    Page<Transaction> findByUserIdOrderByDateDesc(Long userId, Pageable pageable);

    // Find transactions filtered by month, year, type, category
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
           "AND (:month IS NULL OR MONTH(t.date) = :month) " +
           "AND (:year IS NULL OR YEAR(t.date) = :year) " +
           "AND (:type IS NULL OR t.type = :type) " +
           "AND (:categoryId IS NULL OR t.category.id = :categoryId) " +
           "ORDER BY t.date DESC")
    Page<Transaction> findByFilters(@Param("userId") Long userId,
                                   @Param("month") Integer month,
                                   @Param("year") Integer year,
                                   @Param("type") TransactionType type,
                                   @Param("categoryId") Long categoryId,
                                   Pageable pageable);

    // Sum income for a user in a given month/year
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type AND MONTH(t.date) = :month AND YEAR(t.date) = :year")
    BigDecimal sumByTypeAndMonth(@Param("userId") Long userId, @Param("type") TransactionType type, @Param("month") int month, @Param("year") int year);

    // Category-wise expense breakdown for a user in a given month/year
    @Query("SELECT t.category.name, SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type AND MONTH(t.date) = :month AND YEAR(t.date) = :year GROUP BY t.category.name")
    List<Object[]> categoryWiseByTypeAndMonth(@Param("userId") Long userId, @Param("type") TransactionType type, @Param("month") int month, @Param("year") int year);

    // Last 6 months trend for a user
    @Query("SELECT MONTH(t.date), YEAR(t.date), SUM(t.amount), t.type FROM Transaction t WHERE t.user.id = :userId AND t.date >= :sixMonthsAgo GROUP BY MONTH(t.date), YEAR(t.date), t.type ORDER BY YEAR(t.date), MONTH(t.date)")
    List<Object[]> monthlyTrend(@Param("userId") Long userId, @Param("sixMonthsAgo") LocalDate sixMonthsAgo);

    // Find all transactions for a user in a specific month/year (for dashboard calculation)
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND MONTH(t.date) = :month AND YEAR(t.date) = :year")
    List<Transaction> findByUserIdAndMonthAndYear(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);

    // Count transactions for a user in a specific category
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.user.id = :userId AND t.category.id = :categoryId")
    long countByUserIdAndCategoryId(@Param("userId") Long userId, @Param("categoryId") Long categoryId);
}
