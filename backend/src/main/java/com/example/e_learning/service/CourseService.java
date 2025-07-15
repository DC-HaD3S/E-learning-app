package com.example.e_learning.service;

import com.example.e_learning.dto.CourseDTO;
import com.example.e_learning.entity.Course;
import com.example.e_learning.entity.InstructorApplication;
import com.example.e_learning.entity.User;
import com.example.e_learning.repository.CourseRepository;
import com.example.e_learning.repository.InstructorApplicationRepository;
import com.example.e_learning.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired private CourseRepository courseRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private InstructorApplicationRepository instructorApplicationRepository;

    public List<CourseDTO> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<CourseDTO> getCoursesByInstructor() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found: " + username));
        if (!user.getRole().equals("INSTRUCTOR")) {
            throw new IllegalStateException("User is not an instructor");
        }
        InstructorApplication instructorApp = instructorApplicationRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("Instructor application not found for user: " + username));
        List<Course> courses = courseRepository.findByInstructorId(instructorApp.getId());
        if (courses.isEmpty()) {
            throw new IllegalStateException("No courses found for instructor application ID: " + instructorApp.getId());
        }
        return courses.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Course createCourse(CourseDTO courseDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found: " + username));

        if (!user.getRole().equals("ADMIN") && !user.getRole().equals("INSTRUCTOR")) {
            throw new IllegalStateException("Only admins and instructors can create courses");
        }

        Course course = new Course();
        course.setTitle(courseDTO.getTitle());
        course.setBody(courseDTO.getBody());
        course.setImageUrl(courseDTO.getImageUrl());
        course.setPrice(courseDTO.getPrice());

        // If user is an instructor, they must provide their own instructorId
        if (user.getRole().equals("INSTRUCTOR")) {
            if (courseDTO.getInstructorId() == null) {
                throw new IllegalArgumentException("Instructor ID is required for instructors");
            }

            InstructorApplication instructorApp = instructorApplicationRepository.findById(courseDTO.getInstructorId())
                    .orElseThrow(() -> new IllegalStateException("Instructor application not found: " + courseDTO.getInstructorId()));

            if (!instructorApp.getUser().getId().equals(user.getId())) {
                throw new IllegalStateException("Instructor application does not belong to the authenticated user");
            }

            course.setInstructor(instructorApp);
        }

        // Admins should not set instructor; ignore instructorId if present
        return courseRepository.save(course);
    }

    public void setCourseInstructor(Long courseId, Long instructorId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found: " + username));
        if (!user.getRole().equals("ADMIN")) {
            throw new IllegalStateException("Only admins can set course instructors");
        }
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));
        if (instructorId == null) {
            throw new IllegalArgumentException("Instructor ID is required");
        }
        InstructorApplication instructorApp = instructorApplicationRepository.findById(instructorId)
                .orElseThrow(() -> new IllegalStateException("Instructor application not found: " + instructorId));
        course.setInstructor(instructorApp);
        courseRepository.save(course);
    }

    public void updateCourse(Long courseId, CourseDTO courseDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found: " + username));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));
        if (!user.getRole().equals("ADMIN")) {
            InstructorApplication instructorApp = instructorApplicationRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new IllegalStateException("Instructor application not found for user: " + username));
            if (course.getInstructor() == null || !course.getInstructor().getId().equals(instructorApp.getId())) {
                throw new IllegalStateException("Access denied: you can only update your own courses");
            }
        }
        course.setTitle(courseDTO.getTitle());
        course.setBody(courseDTO.getBody());
        course.setImageUrl(courseDTO.getImageUrl());
        course.setPrice(courseDTO.getPrice());
        courseRepository.save(course);
    }

    public void deleteCourse(Long courseId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found: " + username));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));
        if (!user.getRole().equals("ADMIN")) {
            InstructorApplication instructorApp = instructorApplicationRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new IllegalStateException("Instructor application not found for user: " + username));
            if (course.getInstructor() == null || !course.getInstructor().getId().equals(instructorApp.getId())) {
                throw new IllegalStateException("Access denied: you can only delete your own courses");
            }
        }
        courseRepository.deleteById(courseId);
    }

    public CourseDTO convertToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setBody(course.getBody());
        dto.setImageUrl(course.getImageUrl());
        dto.setPrice(course.getPrice());
        dto.setInstructorId(course.getInstructor() != null ? course.getInstructor().getId() : null);
        return dto;
    }

    public List<Course> getCoursesByInstructorId(Long instructorId) {
        return courseRepository.findByInstructorId(instructorId);
    }

    public Course findById(Long courseId) {
        return courseRepository.findById(courseId).orElse(null);
    }
}