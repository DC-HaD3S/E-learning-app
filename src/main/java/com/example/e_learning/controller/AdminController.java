package com.example.e_learning.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.e_learning.entity.Course;
import com.example.e_learning.entity.EnrolledUser;
import com.example.e_learning.entity.Feedback;
import com.example.e_learning.entity.InstructorApplication;
import com.example.e_learning.entity.User;
import com.example.e_learning.service.CourseService;
import com.example.e_learning.service.EnrollmentService;
import com.example.e_learning.service.FeedbackService;
import com.example.e_learning.service.InstructorService;
import com.example.e_learning.service.UserService;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin API", description = "Endpoints for admin users to manage the system")
public class AdminController {
    @Autowired
    private UserService userService;
    @Autowired
    private FeedbackService feedbackService;
    @Autowired
    private InstructorService instructorService;
    @Autowired
    private EnrollmentService enrollmentService;
    @Autowired
    private CourseService courseService;

    @Operation(summary = "Get registered users", description = "Retrieve a list of all registered users")
    @GetMapping("/registered-users")
    public ResponseEntity<List<User>> getRegisteredUsers() {
        return ResponseEntity.ok(userService.getRegisteredUsers());
    }

    @Operation(summary = "Get all feedback", description = "Retrieve all feedback submissions")
    @GetMapping("/feedbacks")
    public ResponseEntity<List<Feedback>> getFeedbacks() {
        return ResponseEntity.ok(feedbackService.getFeedbacks());
    }

    @Operation(summary = "Get instructor applications", description = "Retrieve all instructor applications")
    @GetMapping("/instructors")
    public ResponseEntity<List<InstructorApplication>> getInstructors() {
        return ResponseEntity.ok(instructorService.getInstructors());
    }

    @Operation(summary = "Get enrolled users", description = "Retrieve all user-course enrollment mappings for admin")
    @GetMapping("/enrolled")
    public ResponseEntity<List<EnrolledUser>> getEnrolled() {
        return ResponseEntity.ok(enrollmentService.getEnrolled());
    }

    @Operation(summary = "Create a new course", description = "Add a new course to the database")
    @PostMapping("/manage-courses")
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        return ResponseEntity.ok(courseService.createCourse(course));
    }

    @Operation(summary = "Get all courses", description = "Retrieve a list of all courses for admin")
    @GetMapping("/manage-courses")
    public ResponseEntity<List<Course>> getCourses() {
        return ResponseEntity.ok(courseService.getCourseList());
    }

    @Operation(summary = "Update a course", description = "Update details of a specific course by course ID")
    @PutMapping("/manage-courses/{courseid}")
    public ResponseEntity<Course> updateCourse(@PathVariable Integer courseid, @RequestBody Course course) {
        Course updated = courseService.updateCourse(courseid, course);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.status(404).body(null);
    }

    @Operation(summary = "Delete a course", description = "Remove a course from the database by course ID")
    @DeleteMapping("/manage-courses/{courseid}")
    public ResponseEntity<String> deleteCourse(@PathVariable Integer courseid) {
        boolean deleted = courseService.deleteCourse(courseid);
        if (deleted) {
            return ResponseEntity.ok("Course deleted successfully");
        }
        return ResponseEntity.status(404).body("Course not found");
    }
}