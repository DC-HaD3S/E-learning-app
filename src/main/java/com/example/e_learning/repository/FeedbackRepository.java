package com.example.e_learning.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.e_learning.entity.Feedback;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    List<Feedback> findByUserid(Integer userid);
}
