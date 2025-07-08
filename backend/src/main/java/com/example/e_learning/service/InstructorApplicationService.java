package com.example.e_learning.service;

import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.e_learning.dto.InstructorApplicationDTO;
import com.example.e_learning.dto.InstructorApplicationRequestDTO;
import com.example.e_learning.entity.InstructorApplication;
import com.example.e_learning.entity.User;
import com.example.e_learning.repository.InstructorApplicationRepository;
import com.example.e_learning.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
public class InstructorApplicationService {

    private static final Logger logger = LoggerFactory.getLogger(InstructorApplicationService.class);

    @Autowired
    private InstructorApplicationRepository instructorRepo;

    @Autowired
    private UserRepository userRepo;

    @Transactional
    public void submitApplication(InstructorApplicationRequestDTO dto, String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));

        if (user.getRole().equals("INSTRUCTOR")) {
            throw new IllegalStateException("User is already an instructor");
        }

        InstructorApplication application = new InstructorApplication();
        application.setName(user.getName());
        application.setEmail(user.getEmail());
        application.setQualifications(dto.getQualifications());
        application.setExperience(dto.getExperience());
        application.setUser(user);
        application.setCourses(dto.getCourses());
        application.setApproved(false);

        instructorRepo.save(application);
        logger.info("Application submitted for user: {}, approved: {}", username, application.isApproved());
    }

    public List<InstructorApplicationDTO> getAllApplications() {
        List<InstructorApplication> applications = instructorRepo.findAll();
        return applications.stream()
                .map(application -> {
                    InstructorApplicationDTO dto = new InstructorApplicationDTO();
                    dto.setId(application.getId());
                    dto.setName(application.getName());
                    dto.setEmail(application.getEmail());
                    dto.setQualifications(application.getQualifications());
                    dto.setExperience(application.getExperience());
                    dto.setCourses(application.getCourses());
                    dto.setApproved(application.isApproved());
                    logger.debug("Mapping application ID: {}, approved: {}", application.getId(), application.isApproved());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void approveApplication(Long applicationId, String approvedCourses) {
        InstructorApplication application = instructorRepo.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found: " + applicationId));

        User user = application.getUser();
        if (user == null) {
            throw new IllegalStateException("No user associated with application: " + applicationId);
        }

        user.setRole("INSTRUCTOR");

        if (approvedCourses != null && !approvedCourses.trim().isEmpty()) {
            application.setCourses(approvedCourses);
        }

        application.setApproved(true);

        userRepo.save(user);
        instructorRepo.save(application);
        logger.info("Application ID: {} approved, courses: {}", applicationId, application.getCourses());
    }
}