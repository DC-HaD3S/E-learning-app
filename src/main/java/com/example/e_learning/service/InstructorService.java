package com.example.e_learning.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.e_learning.entity.InstructorApplication;
import com.example.e_learning.repository.InstructorApplicationRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InstructorService {
    @Autowired
    private InstructorApplicationRepository instructorApplicationRepository;

    public InstructorApplication applyAsInstructor(InstructorApplication application) {
        application.setAppliedAt(LocalDateTime.now());
        application.setStatus("pending");
        return instructorApplicationRepository.save(application);
    }

    public List<InstructorApplication> getInstructors() {
        return instructorApplicationRepository.findAll();
    }
}
