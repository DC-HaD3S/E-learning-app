package com.example.e_learning.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.e_learning.entity.Course;
public interface CourseRepository extends JpaRepository<Course, Integer> {
	
}