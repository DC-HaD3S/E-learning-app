package com.example.e_learning.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.e_learning.entity.EnrolledUser;
import com.example.e_learning.repository.EnrolledUserRepository;

import java.util.List;

@Service
public class EnrollmentService {
    @Autowired
    private EnrolledUserRepository enrolledUserRepository;

    public List<EnrolledUser> getEnrolled() {
        return enrolledUserRepository.findAll();
    }
}