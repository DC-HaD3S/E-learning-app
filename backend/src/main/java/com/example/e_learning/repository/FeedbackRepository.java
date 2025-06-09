package com.example.e_learning.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.e_learning.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}
