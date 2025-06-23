package com.example.e_learning.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.e_learning.dto.CourseDTO;
import com.example.e_learning.service.CourseService;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "course")
@RestController
@RequestMapping("/courses")
public class CourseController {
    @Autowired CourseService courseService;

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        try {
            return ResponseEntity.ok(courseService.getAllCourses());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
