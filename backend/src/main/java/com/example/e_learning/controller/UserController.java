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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired private UserService userService;
    @Autowired private EnrollmentService enrollmentService;

    @PostMapping("/apply-course")
    public ResponseEntity<Map<String, String>> enroll(@Valid @RequestBody EnrollmentDTO enrollmentDTO, Principal principal) {
        Map<String, String> response = new HashMap<>();
        try {
            if (enrollmentDTO.getCourseId() == null) {
                response.put("message", "Course ID is required");
                return ResponseEntity.badRequest().body(response);
            }
            enrollmentService.enrollUserToCourse(principal.getName(), enrollmentDTO.getCourseId());
            response.put("message", "User enrolled successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Enrollment failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/enrolled-courses")
    public ResponseEntity<?> getEnrolled(Principal principal) {
        try {
            User currentUser = userService.findByUsername(principal.getName()).orElse(null);
            if (currentUser == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found");
                return ResponseEntity.status(404).body(error);
            }
            List<EnrollmentDTO> enrollments = enrollmentService.getEnrollmentsByUserId(currentUser.getId());
            return ResponseEntity.ok(enrollments);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to fetch enrolled courses");
            return ResponseEntity.badRequest().body(error);
        }
    }
}
