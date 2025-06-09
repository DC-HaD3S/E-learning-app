package com.example.e_learning.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.security.Principal;

import com.example.e_learning.dto.FeedbackDTO;
import com.example.e_learning.service.FeedbackService;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    @Autowired
    private FeedbackService feedbackService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/submit")
    public ResponseEntity<String> submitFeedback( @RequestBody FeedbackDTO dto, Principal principal) {
        try {
            feedbackService.submitFeedback(dto, principal.getName());
            return ResponseEntity.ok("Feedback submitted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Feedback submission failed: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<FeedbackDTO>> getAllFeedbacks() {
        try {
            return ResponseEntity.ok(feedbackService.getAllFeedbacks());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
