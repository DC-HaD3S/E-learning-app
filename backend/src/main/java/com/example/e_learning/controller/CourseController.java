package com.example.e_learning.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.e_learning.dto.CourseDTO;
import com.example.e_learning.service.CourseService;

@RestController
@RequestMapping("/courses")
public class CourseController {
    @Autowired CourseService courseService;

    @GetMapping
    public List<CourseDTO> getAllCourses() {
        return courseService.getAllCourses();
    }
}
