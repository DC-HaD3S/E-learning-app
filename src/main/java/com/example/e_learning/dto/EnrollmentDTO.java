package com.example.e_learning.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class EnrollmentDTO {
    @NotBlank(message = "Username cannot be empty")
    private String username;
    @Min(value = 1, message = "Course ID must be positive")
    private Long courseId;
    @NotBlank(message = "Course name cannot be empty")
    private String courseName;

    // Getters and setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    // Keep the CourseDTO for user-facing endpoints
    public static class CourseDTO {
        private Long id;
        @NotBlank(message = "Title cannot be empty")
        private String title;
        private String body;
        private String imageUrl;
        @Min(value = 0, message = "Price cannot be negative")
        private Integer price;

        // Getters and setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getBody() {
            return body;
        }

        public void setBody(String body) {
            this.body = body;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public Integer getPrice() {
            return price;
        }

        public void setPrice(Integer price) {
            this.price = price;
        }
    }
}