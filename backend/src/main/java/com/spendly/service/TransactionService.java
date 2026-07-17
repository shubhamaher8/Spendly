package com.spendly.service;

import com.spendly.dto.*;
import com.spendly.entity.Category;
import com.spendly.entity.Transaction;
import com.spendly.entity.TransactionType;
import com.spendly.entity.User;
import com.spendly.repository.CategoryRepository;
import com.spendly.repository.TransactionRepository;
import com.spendly.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              CategoryRepository categoryRepository,
                              UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    // Get logged-in user from SecurityContext
    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Get transactions with filters (paginated)
    public Page<TransactionResponse> getTransactions(int page, int size,
                                                      Integer month, Integer year,
                                                      TransactionType type, Long categoryId) {
        User user = getLoggedInUser();
        PageRequest pageRequest = PageRequest.of(page, size);

        Page<Transaction> transactions = transactionRepository.findByFilters(
            user.getId(), month, year, type, categoryId, pageRequest
        );

        return transactions.map(t -> new TransactionResponse(
            t.getId(),
            t.getAmount(),
            t.getType(),
            t.getDescription(),
            t.getDate(),
            t.getCategory().getName(),
            t.getCreatedAt()
        ));
    }

    // Create a new transaction
    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request) {
        User user = getLoggedInUser();

        Category category = categoryRepository.findByIdAndUserId(request.categoryId(), user.getId())
            .orElseThrow(() -> new RuntimeException("Category not found"));

        Transaction transaction = new Transaction();
        transaction.setAmount(request.amount());
        transaction.setType(request.type());
        transaction.setDescription(request.description());
        transaction.setDate(request.date());
        transaction.setUser(user);
        transaction.setCategory(category);

        Transaction saved = transactionRepository.save(transaction);

        return new TransactionResponse(
            saved.getId(),
            saved.getAmount(),
            saved.getType(),
            saved.getDescription(),
            saved.getDate(),
            saved.getCategory().getName(),
            saved.getCreatedAt()
        );
    }

    // Update a transaction
    @Transactional
    public TransactionResponse updateTransaction(Long id, TransactionRequest request) {
        User user = getLoggedInUser();

        Transaction transaction = transactionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Ensure user owns this transaction
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to update this transaction");
        }

        Category category = categoryRepository.findByIdAndUserId(request.categoryId(), user.getId())
            .orElseThrow(() -> new RuntimeException("Category not found"));

        transaction.setAmount(request.amount());
        transaction.setType(request.type());
        transaction.setDescription(request.description());
        transaction.setDate(request.date());
        transaction.setCategory(category);

        Transaction saved = transactionRepository.save(transaction);

        return new TransactionResponse(
            saved.getId(),
            saved.getAmount(),
            saved.getType(),
            saved.getDescription(),
            saved.getDate(),
            saved.getCategory().getName(),
            saved.getCreatedAt()
        );
    }

    // Delete a transaction
    @Transactional
    public void deleteTransaction(Long id) {
        User user = getLoggedInUser();

        Transaction transaction = transactionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to delete this transaction");
        }

        transactionRepository.deleteById(id);
    }
}
