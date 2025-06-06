package com.example.e_learning.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.e_learning.entity.EnrolledCourse;

import java.util.List;

public interface EnrolledCourseRepository extends JpaRepository<EnrolledCourse, Integer> {
    List<EnrolledCourse> findByUserid(Integer userid);
}