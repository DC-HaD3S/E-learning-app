package com.example.e_learning.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.e_learning.dto.CourseDTO;
import com.example.e_learning.entity.Course;
import com.example.e_learning.repository.CourseRepository;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    // Get all courses
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Create a new course
    public void createCourse(@Valid CourseDTO courseDTO) {
        Course course = new Course();
        course.setTitle(courseDTO.getTitle());
        course.setBody(courseDTO.getBody());
        course.setImageUrl(courseDTO.getImageUrl());
        course.setPrice(courseDTO.getPrice());
        courseRepository.save(course);
    }

    // Update an existing course
    public void updateCourse(Long courseId, @Valid CourseDTO courseDTO) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with ID: " + courseId));
        if (courseDTO.getTitle() != null) {
            course.setTitle(courseDTO.getTitle());
        }
        if (courseDTO.getBody() != null) {
            course.setBody(courseDTO.getBody());
        }
        if (courseDTO.getImageUrl() != null) {
            course.setImageUrl(courseDTO.getImageUrl());
        }
        if (courseDTO.getPrice() != null) {
            course.setPrice(courseDTO.getPrice());
        }
        courseRepository.save(course);
    }

    // Delete a course
    public void deleteCourse(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new IllegalArgumentException("Course not found with ID: " + courseId);
        }
        courseRepository.deleteById(courseId);
    }

    // Convert Course entity to CourseDTO
    private CourseDTO convertToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setBody(course.getBody());
        dto.setImageUrl(course.getImageUrl());
        dto.setPrice(course.getPrice());
        return dto;
    }
}