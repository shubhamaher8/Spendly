package com.spendly.service;

import com.spendly.dto.*;
import com.spendly.entity.Category;
import com.spendly.entity.User;
import com.spendly.repository.CategoryRepository;
import com.spendly.repository.UserRepository;
import com.spendly.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Default categories created on registration
    private static final List<String> DEFAULT_CATEGORIES = List.of(
        "Food", "Transport", "Entertainment", "Health", "Salary", "Other"
    );

    public AuthService(UserRepository userRepository,
                       CategoryRepository categoryRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // Register new user with default categories
    @Transactional
    public LoginResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Create and save user
        User user = new User(
            request.name(),
            request.email(),
            passwordEncoder.encode(request.password())
        );
        user = userRepository.save(user);

        // Seed default categories
        for (String categoryName : DEFAULT_CATEGORIES) {
            categoryRepository.save(new Category(categoryName, user));
        }

        // Generate token and return
        String token = jwtUtil.generateToken(user.getEmail());
        return new LoginResponse(token, user.getName(), user.getEmail());
    }

    // Login existing user
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new LoginResponse(token, user.getName(), user.getEmail());
    }
}
