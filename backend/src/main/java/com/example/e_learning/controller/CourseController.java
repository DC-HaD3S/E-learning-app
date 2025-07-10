package com.example.e_learning.controller;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.e_learning.dto.CourseDTO;
import com.example.e_learning.dto.EnrollmentDTO;
import com.example.e_learning.entity.Course;
import com.example.e_learning.entity.User;
import com.example.e_learning.service.CourseService;
import com.example.e_learning.service.EnrollmentService;
import com.example.e_learning.service.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;

@Tag(name = "courses", description = "Endpoints for managing courses, including creation, update, deletion, and enrollment")
@RestController
@RequestMapping("/courses")
public class CourseController {
    @Autowired CourseService courseService;
    @Autowired private UserService userService;
    @Autowired private EnrollmentService enrollmentService;

    @Operation(
        summary = "Get all courses",
        description = "Public endpoint to view all courses, accessible to unauthenticated users, users, instructors, and admins.",
        responses = {
            @ApiResponse(responseCode = "200", description = "List of all courses", 
                         content = @Content(mediaType = "application/json", schema = @Schema(implementation = CourseDTO.class, type = "array"))),
            @ApiResponse(responseCode = "400", description = "Bad request, returns empty list", 
                         content = @Content(mediaType = "application/json", schema = @Schema(implementation = CourseDTO.class, type = "array")))
        }
    )
    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        try {
            return ResponseEntity.ok(courseService.getAllCourses());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }

    @Operation(
        summary = "Get instructor's own courses",
        description = "Allows an instructor to view only their own courses, based on their user ID.",
        responses = {
            @ApiResponse(responseCode = "200", description = "List of instructor's courses", 
                         content = @Content(mediaType = "application/json", schema = @Schema(implementation = CourseDTO.class, type = "array"))),
            @ApiResponse(responseCode = "400", description = "Bad request or user not found, returns empty list", 
                         content = @Content(mediaType = "application/json", schema = @Schema(implementation = CourseDTO.class, type = "array"))),
            @ApiResponse(responseCode = "403", description = "Unauthorized: Instructor access required", 
                         content = @Content(mediaType = "application/json", schema = @Schema(implementation = CourseDTO.class, type = "array")))
        }
    )
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @GetMapping("/my-courses")
    public ResponseEntity<List<CourseDTO>> getMyCourses(
        @Parameter(description = "Authenticated user's principal", hidden = true) 
        Principal principal) {
        try {
            User user = userService.findByUsername(principal.getName())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            List<Course> courses = courseService.getCoursesByInstructorId(user.getId());
            List<CourseDTO> courseDTOs = courses.stream()
                    .map(courseService::convertToDTO)
                    .toList();
            return ResponseEntity.ok(courseDTOs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.emptyList());
        }
    }

    @Operation(
        summary = "Create a new course",
        description = "Allows an admin or instructor to create a course. The course is associated with the authenticated instructor or admin.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Course created successfully", 
                         content = @Content(mediaType = "application/json", schema = @Schema(type = "object", example = "{\"message\": \"Course created successfully\", \"data\": {\"id\": 1, \"title\": \"string\", \"body\": \"string\", \"imageUrl\": \"string\", \"price\": 0.0, \"instructorId\": 1}}"))),
            @ApiResponse(responseCode = "400", description = "Invalid request or user not found", 
                         content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "403", description = "Unauthorized: Admin or instructor access required", 
                         content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class)))
        }
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @PostMapping
    public ResponseEntity<Map<String, Object>> createCourse(
        @Valid @RequestBody @Parameter(description = "Course details to create", required = true) 
        CourseDTO courseDTO,
        @Parameter(description = "Authenticated user's principal", hidden = true) 
        Principal principal) {
        try {
            User user = userService.findByUsername(principal.getName())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            courseDTO.setInstructorId(user.getId());
            Course course = courseService.createCourse(courseDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Course created successfully");
            response.put("data", courseService.convertToDTO(course));
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Course creation failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Course creation failed: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @Operation(
        summary = "Update a course",
        description = "Allows an admin to update any course or an instructor to update their own course.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Course updated successfully", 
                         content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class, example = "{\"message\": \"Course updated successfully\"}"))),
            @ApiResponse(responseCode = "400", description = "Invalid request", 
                         content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "403", description = "Unauthorized: Admin or course owner access required", 
                         content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "404", description = "Course or user not found", 
                         content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class)))
        }
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @PutMapping("/{courseId}")
    public ResponseEntity<Map<String, String>> updateCourse(
        @Parameter(description = "ID of the course to update", required = true) 
        @PathVariable Long courseId,
        @Valid @RequestBody @Parameter(description = "Updated course details", required = true) 
        CourseDTO courseDTO,
        @Parameter(description = "Authenticated user's principal", hidden = true) 
        Principal principal) {
        try {
            User user = userService.findByUsername(principal.getName())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            Course course = courseService.findById(courseId);
            if (course == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Course not found");
                return ResponseEntity.status(404).body(errorResponse);
            }
            boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole());
            if (!isAdmin && (course.getInstructor() == null || !course.getInstructor().getId().equals(user.getId()))) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Access denied: you can only update your own courses");
                return ResponseEntity.status(403).body(errorResponse);
            }
            courseService.updateCourse(courseId, courseDTO);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Course updated successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(404).body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Course update failed: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @Operation(
        summary = "Delete a course",
        description = "Allows an admin to delete any course or an instructor to delete their own course.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Course deleted successfully", 
                         content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class, example = "{\"message\": \"Course deleted successfully\"}"))),
            @ApiResponse(responseCode = "400", description = "Invalid request", 
                         content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "403", description = "Unauthorized: Admin or course owner access required", 
                         content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "404", description = "Course or user not found", 
                         content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class)))
        }
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @DeleteMapping("/{courseId}")
    public ResponseEntity<Map<String, String>> deleteCourse(
        @Parameter(description = "ID of the course to delete", required = true) 
        @PathVariable Long courseId,
        @Parameter(description = "Authenticated user's principal", hidden = true) 
        Principal principal) {
        try {
            User user = userService.findByUsername(principal.getName())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            Course course = courseService.findById(courseId);
            if (course == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Course not found");
                return ResponseEntity.status(404).body(errorResponse);
            }
            boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole());
            if (!isAdmin && (course.getInstructor() == null || !course.getInstructor().getId().equals(user.getId()))) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Access denied: you can only delete your own courses");
                return ResponseEntity.status(403).body(errorResponse);
            }
            courseService.deleteCourse(courseId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Course deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(404).body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Course deletion failed: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @Operation(
        summary = "Get enrolled courses",
        description = "Allows a user or admin to view their enrolled courses.",
        responses = {
            @ApiResponse(responseCode = "200", description = "List of enrolled courses", 
                         content = @Content(mediaType = "application/json", schema = @Schema(implementation = EnrollmentDTO.class, type = "array"))),
            @ApiResponse(responseCode = "400", description = "Bad request, returns empty list", 
                         content = @Content(mediaType = "application/json", schema = @Schema(implementation = EnrollmentDTO.class, type = "array"))),
            @ApiResponse(responseCode = "403", description = "Unauthorized: User or admin access required", 
                         content = @Content(mediaType = "application/json", schema = @Schema(implementation = EnrollmentDTO.class, type = "array"))),
            @ApiResponse(responseCode = "404", description = "User not found, returns empty list", 
                         content = @Content(mediaType = "application/json", schema = @Schema(implementation = EnrollmentDTO.class, type = "array")))
        }
    )
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/enrolled-courses")
    public ResponseEntity<List<EnrollmentDTO>> getEnrolled(
        @Parameter(description = "Authenticated user's principal", hidden = true) 
        Principal principal) {
        try {
            User currentUser = userService.findByUsername(principal.getName())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            List<EnrollmentDTO> enrollments = enrollmentService.getEnrollmentsByUserId(currentUser.getId());
            return ResponseEntity.ok(enrollments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Collections.emptyList());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.emptyList());
        }
    }
}