package com.example.e_learning.controller;

import com.example.e_learning.dto.CourseContentDTO;
import com.example.e_learning.entity.CourseContent;
import com.example.e_learning.service.CourseContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-content")
public class CourseContentController {

    private final CourseContentService courseContentService;

    public CourseContentController(CourseContentService courseContentService) {
        this.courseContentService = courseContentService;
    }

    @Operation(summary = "Add course content for a specific course", 
               description = "Creates multiple course content entries for a given course ID. Admins can add content to any course; instructors only to their own.")
    @ApiResponse(responseCode = "200", description = "Content created successfully", 
                 content = @Content(schema = @Schema(implementation = CourseContent.class)))
    @PostMapping("/course/{courseId}")
    public List<CourseContent> addCourseContent(@PathVariable Long courseId, 
                                               @RequestBody List<CourseContentDTO> contentDTOs) {
        return courseContentService.createCourseContent(courseId, contentDTOs);
    }

    @Operation(summary = "Get all course content", 
               description = "Retrieves all course content entries.")
    @GetMapping
    public List<CourseContentDTO> getAllCourseContent() {
        return courseContentService.getAllCourseContent();
    }

    @Operation(summary = "Get course content by course ID", 
               description = "Retrieves all course content for a specific course.")
    @GetMapping("/course/{courseId}")
    public List<CourseContentDTO> getCourseContentByCourseId(@PathVariable Long courseId) {
        return courseContentService.getCourseContentByCourseId(courseId);
    }

    @Operation(summary = "Update course content", 
               description = "Updates a specific course content entry. Admins can update any content; instructors only their own.")
    @PutMapping("/{contentId}")
    public void updateCourseContent(@PathVariable Long contentId, @RequestBody CourseContentDTO dto) {
        courseContentService.updateCourseContent(contentId, dto);
    }

    @Operation(summary = "Delete course content", 
               description = "Deletes a specific course content entry. Admins can delete any content; instructors only their own.")
    @DeleteMapping("/{contentId}")
    public void deleteCourseContent(@PathVariable Long contentId) {
        courseContentService.deleteCourseContent(contentId);
    }
}