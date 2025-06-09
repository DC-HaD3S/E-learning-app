package com.example.e_learning.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.e_learning.dto.EnrollmentDTO;
import com.example.e_learning.entity.User;
import com.example.e_learning.service.EnrollmentService;
import com.example.e_learning.service.UserService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {
    @Autowired
    private EnrollmentService enrollmentService;
    @Autowired
    private UserService userService;

    @PostMapping("/apply")
    public ResponseEntity<String> enroll(
            @Valid @RequestBody EnrollmentDTO enrollmentDTO,
            Principal principal) {
        try {
            if (enrollmentDTO.getCourseId() == null) {
                return ResponseEntity.badRequest().body("Course ID is required");
            }
            enrollmentService.enrollUserToCourse(principal.getName(), enrollmentDTO.getCourseId());
            return ResponseEntity.ok("User enrolled successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Enrollment failed: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<EnrollmentDTO>> getEnrollments(
            @PathVariable Long userId,
            Principal principal) {
        try {
            User currentUser = userService.findByUsername(principal.getName())
                    .orElse(null);
            if (currentUser == null) {
                return ResponseEntity.status(404).body(Collections.emptyList());
            }
            if (!currentUser.getId().equals(userId)) {
                return ResponseEntity.status(403).body(Collections.emptyList());
            }
            List<EnrollmentDTO> enrollments = enrollmentService.getEnrollmentsByUserId(userId);
            return ResponseEntity.ok(enrollments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }
}