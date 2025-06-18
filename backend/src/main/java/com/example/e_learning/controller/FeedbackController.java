
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

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateFeedback(@PathVariable Long id, @Valid @RequestBody FeedbackDTO dto, Principal principal) {
        Map<String, String> response = new HashMap<>();
        try {
            dto.setUsername(principal.getName());
            feedbackService.updateFeedback(id, dto);
            response.put("message", "Feedback updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Feedback update failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteFeedback(@PathVariable Long id, Principal principal) {
        Map<String, String> response = new HashMap<>();
        try {
            feedbackService.deleteFeedback(id, principal.getName());
            response.put("message", "Feedback deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Feedback deletion failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<FeedbackDTO>> getAllFeedbacks() {
        try {
            return ResponseEntity.ok(feedbackService.getAllFeedbacks());
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<FeedbackDTO>> getFeedbacksByCourseId(@PathVariable Long courseId) {
        try {
            return ResponseEntity.ok(feedbackService.getFeedbacksByCourseId(courseId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/allByCourseId")
    public ResponseEntity<List<FeedbackDTO>> getAllFeedbacksByCourseId(@RequestParam Long courseId) {
        try {
            return ResponseEntity.ok(feedbackService.getAllFeedbacksByCourseId(courseId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }
}
