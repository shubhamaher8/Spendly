package com.spendly.service;

import com.spendly.dto.CategoryRequest;
import com.spendly.dto.CategoryResponse;
import com.spendly.entity.Category;
import com.spendly.entity.User;
import com.spendly.repository.CategoryRepository;
import com.spendly.repository.TransactionRepository;
import com.spendly.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public CategoryService(CategoryRepository categoryRepository,
                           TransactionRepository transactionRepository,
                           UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Get all categories for logged-in user
    public List<CategoryResponse> getAllCategories() {
        User user = getLoggedInUser();
        return categoryRepository.findByUserId(user.getId()).stream()
            .map(c -> new CategoryResponse(c.getId(), c.getName()))
            .toList();
    }

    // Create a new category
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        User user = getLoggedInUser();

        Category category = new Category(request.name(), user);
        Category saved = categoryRepository.save(category);

        return new CategoryResponse(saved.getId(), saved.getName());
    }

    // Delete a category (only if no transactions use it)
    @Transactional
    public void deleteCategory(Long id) {
        User user = getLoggedInUser();

        Category category = categoryRepository.findByIdAndUserId(id, user.getId())
            .orElseThrow(() -> new RuntimeException("Category not found"));

        // Check if any transactions use this category
        long transactionCount = transactionRepository.countByUserIdAndCategoryId(user.getId(), id);
        if (transactionCount > 0) {
            throw new RuntimeException("Cannot delete category with existing transactions");
        }

        categoryRepository.deleteById(id);
    }
}
