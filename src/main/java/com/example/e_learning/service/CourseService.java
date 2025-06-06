package com.example.e_learning.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.e_learning.entity.Course;
import com.example.e_learning.entity.EnrolledCourse;
import com.example.e_learning.entity.EnrolledUser;
import com.example.e_learning.repository.CourseRepository;
import com.example.e_learning.repository.EnrolledCourseRepository;
import com.example.e_learning.repository.EnrolledUserRepository;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private EnrolledCourseRepository enrolledCourseRepository;
    @Autowired
    private EnrolledUserRepository enrolledUserRepository;

    public List<Course> getCourseList() {
        return courseRepository.findAll();
    }

    public Course getCourseDetails(Integer courseid) {
        return courseRepository.findById(courseid).orElse(null);
    }

    public EnrolledCourse applyCourse(Integer userid, Integer courseid) {
        Course course = courseRepository.findById(courseid).orElse(null);
        if (course == null) return null;

        // Insert into enrolled_courses for user view
        EnrolledCourse enrollment = new EnrolledCourse();
        enrollment.setUserid(userid);
        enrollment.setCourseid(courseid);
        enrollment.setCourseName(course.getTitle());
        enrollment.setCoursePrice(course.getPrice());
        enrollment.setEnrolledAt(LocalDateTime.now());
        enrolledCourseRepository.save(enrollment);

        // Insert into enrolled_users for admin view
        EnrolledUser enrolledUser = new EnrolledUser();
        enrolledUser.setUserid(userid);
        enrolledUser.setCourseid(courseid);
        enrolledUser.setEnrolledAt(LocalDateTime.now());
        enrolledUserRepository.save(enrolledUser);

        return enrollment;
    }

    public Course createCourse(Course course) {
        course.setCreatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    public Course updateCourse(Integer courseid, Course course) {
        Course existing = courseRepository.findById(courseid).orElse(null);
        if (existing == null) return null;
        existing.setTitle(course.getTitle());
        existing.setBody(course.getBody());
        existing.setImageUrl(course.getImageUrl());
        existing.setPrice(course.getPrice());
        return courseRepository.save(existing);
    }

    public boolean deleteCourse(Integer courseid) {
        if (courseRepository.existsById(courseid)) {
            courseRepository.deleteById(courseid);
            return true;
        }
        return false;
    }
}
