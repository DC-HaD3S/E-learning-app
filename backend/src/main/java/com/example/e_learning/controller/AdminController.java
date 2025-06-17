package com.example.e_learning.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.e_learning.dto.CourseDTO;
import com.example.e_learning.dto.EnrollmentDTO;
import com.example.e_learning.dto.UserDTO;
import com.example.e_learning.entity.Course;
import com.example.e_learning.service.CourseService;
import com.example.e_learning.service.EnrollmentService;
import com.example.e_learning.service.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "admin")
@RestController
@RequestMapping("/admin")
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
    public ResponseEntity<Map<String, Object>> createCourse(@Valid @RequestBody CourseDTO courseDTO) {
        try {
            Course course = courseService.createCourse(courseDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Course created successfully");
            response.put("data", courseService.convertToDTO(course));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Course creation failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PutMapping("/courses/{courseId}")
    public ResponseEntity<Map<String, String>> updateCourse(@PathVariable Long courseId, @Valid @RequestBody CourseDTO courseDTO) {
        try {
            courseService.updateCourse(courseId, courseDTO);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Course updated successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Course update failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Course update failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @DeleteMapping("/courses/{courseId}")
    public ResponseEntity<Map<String, String>> deleteCourse(@PathVariable Long courseId) {
        try {
            courseService.deleteCourse(courseId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Course deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Course deletion failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}