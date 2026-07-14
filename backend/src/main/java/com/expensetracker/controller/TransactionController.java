package com.expensetracker.controller;

import com.expensetracker.dto.*;
import com.expensetracker.entity.TransactionType;
import com.expensetracker.service.TransactionService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // Get all transactions (paginated, filterable)
    @GetMapping
    public ResponseEntity<Page<TransactionResponse>> getTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) Long categoryId) {

        Page<TransactionResponse> transactions = transactionService.getTransactions(
            page, size, month, year, type, categoryId
        );
        return ResponseEntity.ok(transactions);
    }

    // Create a new transaction
    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody TransactionRequest request) {
        try {
            TransactionResponse response = transactionService.createTransaction(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Update a transaction
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(@PathVariable Long id,
                                               @RequestBody TransactionRequest request) {
        try {
            TransactionResponse response = transactionService.updateTransaction(id, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Delete a transaction
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        try {
            transactionService.deleteTransaction(id);
            return ResponseEntity.ok(Map.of("message", "Transaction deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
