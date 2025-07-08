package com.example.e_learning.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.e_learning.dto.CourseDTO;
import com.example.e_learning.entity.Course;
import com.example.e_learning.repository.CourseRepository;

import jakarta.validation.ConstraintViolationException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public Course createCourse(CourseDTO courseDTO) {
        try {
            Course course = new Course();
            course.setTitle(courseDTO.getTitle());
            course.setBody(courseDTO.getBody());
            course.setImageUrl(courseDTO.getImageUrl());
            course.setPrice(courseDTO.getPrice());
            course.setId(null);
            return courseRepository.save(course);
        } catch (ConstraintViolationException e) {
            throw e; // will be caught by global handler
        } catch (Exception e) {
            throw new RuntimeException("Failed to create course: " + e.getMessage(), e);
        }
    }

    public List<CourseDTO> getAllCourses() {
        try {
            return courseRepository.findAll().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch courses", e);
        }
    }

    public void updateCourse(Long courseId, CourseDTO courseDTO) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        course.setTitle(courseDTO.getTitle());
        course.setBody(courseDTO.getBody());
        course.setImageUrl(courseDTO.getImageUrl());
        course.setPrice(courseDTO.getPrice());

        try {
            courseRepository.save(course);
        } catch (ConstraintViolationException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to update course: " + e.getMessage(), e);
        }
    }

    public void deleteCourse(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new IllegalArgumentException("Course not found: " + courseId);
        }

        try {
            courseRepository.deleteById(courseId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete course: " + e.getMessage(), e);
        }
    }

    public CourseDTO convertToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setBody(course.getBody());
        dto.setImageUrl(course.getImageUrl());
        dto.setPrice(course.getPrice());
        return dto;
    }
}
