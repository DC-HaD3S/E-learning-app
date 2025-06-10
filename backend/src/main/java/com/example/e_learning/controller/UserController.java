package com.example.e_learning.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.e_learning.dto.EnrollmentDTO;
import com.example.e_learning.entity.User;
import com.example.e_learning.service.EnrollmentService;
import com.example.e_learning.service.UserService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired private UserService userService;
    @Autowired private EnrollmentService enrollmentService;

    @PostMapping("/apply-course")
    public ResponseEntity<String> enroll(@Valid @RequestBody EnrollmentDTO enrollmentDTO, Principal principal) {
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

    @GetMapping("/enrolled-courses")
    public ResponseEntity<List<EnrollmentDTO>> getEnrolled(Principal principal) {
        try {
            // Get the authenticated user
            User currentUser = userService.findByUsername(principal.getName())
                    .orElse(null);
            if (currentUser == null) {
                return ResponseEntity.status(404).body(Collections.emptyList());
            }
            // Fetch enrolled courses for the logged-in user
            List<EnrollmentDTO> enrollments = enrollmentService.getEnrollmentsByUserId(currentUser.getId());
            return ResponseEntity.ok(enrollments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }
}