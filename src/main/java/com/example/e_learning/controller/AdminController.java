package com.example.e_learning.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.e_learning.dto.CourseDTO;
import com.example.e_learning.dto.EnrollmentDTO;
import com.example.e_learning.dto.UserDTO;
import com.example.e_learning.service.CourseService;
import com.example.e_learning.service.EnrollmentService;
import com.example.e_learning.service.UserService;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {
    @Autowired
    private UserService userService;
    @Autowired
    private EnrollmentService enrollmentService;
    @Autowired
    private CourseService courseService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/enrolled")
    public ResponseEntity<List<EnrollmentDTO>> getAllEnrolledUsers() {
        try {
            return ResponseEntity.ok(enrollmentService.getAllEnrollments());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }


    @PostMapping("/courses")
    public ResponseEntity<String> createCourse(@Valid @RequestBody CourseDTO courseDTO) {
        try {
            courseService.createCourse(courseDTO);
            return ResponseEntity.ok("Course created successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Course creation failed: " + e.getMessage());
        }
    }

    @GetMapping("/courses")
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        try {
            return ResponseEntity.ok(courseService.getAllCourses());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/courses/{courseId}")
    public ResponseEntity<String> updateCourse(@PathVariable Long courseId, @Valid @RequestBody CourseDTO courseDTO) {
        try {
            courseService.updateCourse(courseId, courseDTO);
            return ResponseEntity.ok("Course updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Course update failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/courses/{courseId}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long courseId) {
        try {
            courseService.deleteCourse(courseId);
            return ResponseEntity.ok("Course deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Course deletion failed: " + e.getMessage());
        }
    }
}