package com.example.e_learning.service;

import com.example.e_learning.dto.CourseDTO;
import com.example.e_learning.entity.Course;
import com.example.e_learning.entity.User;
import com.example.e_learning.repository.CourseRepository;
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

    public List<CourseDTO> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Course createCourse(CourseDTO courseDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        if (!user.getRole().equals("ADMIN") && !user.getRole().equals("INSTRUCTOR")) {
            throw new IllegalStateException("Only admins and instructors can create courses");
        }
        Course course = new Course();
        course.setTitle(courseDTO.getTitle());
        course.setBody(courseDTO.getBody());
        course.setImageUrl(courseDTO.getImageUrl());
        course.setPrice(courseDTO.getPrice());
        course.setInstructor(user);
        return courseRepository.save(course);
    }

    public void updateCourse(Long courseId, CourseDTO courseDTO) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) {
            throw new IllegalArgumentException("Course not found");
        }
        course.setTitle(courseDTO.getTitle());
        course.setBody(courseDTO.getBody());
        course.setImageUrl(courseDTO.getImageUrl());
        course.setPrice(courseDTO.getPrice());
        courseRepository.save(course);
    }

    public void deleteCourse(Long courseId) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) {
            throw new IllegalArgumentException("Course not found");
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