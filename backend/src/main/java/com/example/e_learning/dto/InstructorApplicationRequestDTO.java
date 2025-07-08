package com.example.e_learning.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class InstructorApplicationRequestDTO {
    @NotBlank(message = "Qualifications cannot be empty")
    private String qualifications;

    @Min(value = 0, message = "Experience cannot be negative")
    private int experience;

    @NotBlank(message = "Courses cannot be empty")
    private String courses;

    // Getters and setters
    public String getQualifications() {
        return qualifications;
    }

    public void setQualifications(String qualifications) {
        this.qualifications = qualifications;
    }

    public int getExperience() {
        return experience;
    }

    public void setExperience(int experience) {
        this.experience = experience;
    }

    public String getCourses() {
        return courses;
    }

    public void setCourses(String courses) {
        this.courses = courses;
    }
}