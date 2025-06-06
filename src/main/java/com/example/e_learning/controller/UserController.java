package com.example.e_learning.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.e_learning.entity.Course;
import com.example.e_learning.entity.EnrolledCourse;
import com.example.e_learning.entity.Feedback;
import com.example.e_learning.entity.InstructorApplication;
import com.example.e_learning.entity.User;
import com.example.e_learning.service.CourseService;
import com.example.e_learning.service.FeedbackService;
import com.example.e_learning.service.InstructorService;
import com.example.e_learning.service.UserService;

import java.util.List;
import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
@RestController
@RequestMapping("/api")
@Tag(name = "User API", description = "Endpoints for all users (regular and admin)")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private CourseService courseService;
    @Autowired
    private InstructorService instructorService;
    @Autowired
    private FeedbackService feedbackService;

    @Operation(summary = "Sign up a new user", description = "Register a new user with name, email, username, and password")
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signUp(@RequestBody User user) {
        return ResponseEntity.ok(userService.signUp(user));
    }

    @Operation(summary = "User login", description = "Authenticate a user with email and password")
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User loginRequest) {
        return ResponseEntity.ok(userService.login(loginRequest.getEmail(), loginRequest.getPassword()));
    }

    // Other endpoints remain unchanged
    @Operation(summary = "Get course list", description = "Retrieve all available courses")
    @GetMapping("/courselist")
    public ResponseEntity<List<Course>> getCourseList() {
        return ResponseEntity.ok(courseService.getCourseList());
    }

    @Operation(summary = "View course details", description = "Get details of a specific course by course ID")
    @GetMapping("/view-details/{courseid}")
    public ResponseEntity<Course> viewDetails(@PathVariable Integer courseid) {
        Course course = courseService.getCourseDetails(courseid);
        if (course != null) {
            return ResponseEntity.ok(course);
        }
        return ResponseEntity.status(404).body(null);
    }

    @Operation(summary = "Apply as instructor", description = "Submit an application to become an instructor")
    @PostMapping("/apply-as-instructor")
    public ResponseEntity<InstructorApplication> applyAsInstructor(@RequestBody InstructorApplication application) {
        return ResponseEntity.ok(instructorService.applyAsInstructor(application));
    }

    @Operation(summary = "Submit feedback", description = "Submit feedback for a course")
    @PostMapping("/submit-feedback")
    public ResponseEntity<Feedback> submitFeedback(@RequestBody Feedback feedback) {
        return ResponseEntity.ok(feedbackService.submitFeedback(feedback));
    }

    @Operation(summary = "Get enrolled courses", description = "Retrieve courses a user is enrolled in by user ID")
    @GetMapping("/enrolled-courses/{userid}")
    public ResponseEntity<List<EnrolledCourse>> getEnrolledCourses(@PathVariable Integer userid) {
        return ResponseEntity.ok(userService.getEnrolledCourses(userid));
    }

    @Operation(summary = "Apply for a course", description = "Enroll a user in a specific course")
    @PostMapping("/apply-course")
    public ResponseEntity<EnrolledCourse> applyCourse(@RequestBody EnrolledCourse enrollment) {
        EnrolledCourse result = courseService.applyCourse(enrollment.getUserid(), enrollment.getCourseid());
        if (result != null) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(404).body(null);
    }
}