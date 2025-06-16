package com.example.e_learning.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.e_learning.dto.FeedbackDTO;
import com.example.e_learning.service.FeedbackService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/submit")
    public ResponseEntity<Map<String, String>> submitFeedback(@Valid @RequestBody FeedbackDTO dto, Principal principal) {
        Map<String, String> response = new HashMap<>();
        try {
            dto.setUsername(principal.getName()); 
            feedbackService.submitFeedback(dto);  
            response.put("message", "Feedback submitted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Feedback submission failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<FeedbackDTO>> getAllFeedbacks() {
        try {
            return ResponseEntity.ok(feedbackService.getAllFeedbacks());
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.badRequest().body(null);
        }
    }
}
