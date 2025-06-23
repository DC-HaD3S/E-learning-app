package com.example.e_learning.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.e_learning.dto.EnrollmentDTO;
import com.example.e_learning.dto.UserDTO;
import com.example.e_learning.service.EnrollmentService;
import com.example.e_learning.service.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "user")
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

    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/enrolled")
    public ResponseEntity<List<EnrollmentDTO>> getAllEnrolledUsers() {
        try {
            return ResponseEntity.ok(enrollmentService.getAllEnrollments());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
