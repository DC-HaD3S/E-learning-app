package com.example.e_learning.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.e_learning.entity.EnrolledUser;

public interface EnrolledUserRepository extends JpaRepository<EnrolledUser, Integer> {
}