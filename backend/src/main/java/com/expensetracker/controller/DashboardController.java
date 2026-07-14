package com.expensetracker.controller;

import com.expensetracker.dto.DashboardSummary;
import com.expensetracker.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // Get dashboard summary for a given month/year
    @GetMapping("/summary")
    public ResponseEntity<DashboardSummary> getSummary(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        // Default to current month/year if not provided
        LocalDate now = LocalDate.now();
        int m = (month != null) ? month : now.getMonthValue();
        int y = (year != null) ? year : now.getYear();

        return ResponseEntity.ok(dashboardService.getSummary(m, y));
    }
}
