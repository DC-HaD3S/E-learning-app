package com.example.e_learning.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.e_learning.dto.FeedbackDTO;
import com.example.e_learning.entity.Feedback;
import com.example.e_learning.entity.User;
import com.example.e_learning.entity.Course;
import com.example.e_learning.repository.FeedbackRepository;
import com.example.e_learning.repository.UserRepository;
import com.example.e_learning.repository.CourseRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    @Autowired private FeedbackRepository feedbackRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CourseRepository courseRepository;

    public void submitFeedback(FeedbackDTO feedbackDTO) {
        User user = userRepository.findByUsername(feedbackDTO.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + feedbackDTO.getUsername()));

        Course course = courseRepository.findByTitle(feedbackDTO.getCourseName())
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + feedbackDTO.getCourseName()));

        Feedback feedback = new Feedback();
        feedback.setUser(user);
        feedback.setCourse(course);
        feedback.setRating(feedbackDTO.getRating());
        feedback.setComments(feedbackDTO.getComments());

        feedbackRepository.save(feedback);
    }

    public void updateFeedback(Long id, FeedbackDTO feedbackDTO) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found: " + id));

        if (!feedback.getUser().getUsername().equals(feedbackDTO.getUsername())) {
            throw new IllegalArgumentException("You can only update your own feedback");
        }

        Course course = courseRepository.findByTitle(feedbackDTO.getCourseName())
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + feedbackDTO.getCourseName()));

        feedback.setCourse(course);
        feedback.setRating(feedbackDTO.getRating());
        feedback.setComments(feedbackDTO.getComments());

        feedbackRepository.save(feedback);
    }

    public void deleteFeedback(Long id, String username) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found: " + id));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        if (!feedback.getUser().getUsername().equals(username) && 
            !user.getRole().equals("ADMIN")) {
            throw new IllegalArgumentException("You can only delete your own feedback");
        }

        feedbackRepository.deleteById(id);
    }

    public List<FeedbackDTO> getAllFeedbacks() {
        return feedbackRepository.findAll().stream()
                .map(feedback -> {
                    FeedbackDTO dto = new FeedbackDTO();
                    dto.setId(feedback.getId()); 
                    dto.setUsername(feedback.getUser().getUsername());
                    dto.setCourseName(feedback.getCourse().getTitle());
                    dto.setRating(feedback.getRating());
                    dto.setComments(feedback.getComments());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<FeedbackDTO> getFeedbacksByCourseId(Long courseId) {
        return feedbackRepository.findByCourseId(courseId).stream()
                .map(feedback -> {
                    FeedbackDTO dto = new FeedbackDTO();
                    dto.setId(feedback.getId());
                    dto.setUsername(feedback.getUser().getUsername());
                    dto.setCourseName(feedback.getCourse().getTitle());
                    dto.setRating(feedback.getRating());
                    dto.setComments(feedback.getComments());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<FeedbackDTO> getAllFeedbacksByCourseId(Long courseId) {
        return feedbackRepository.findByCourseId(courseId).stream()
                .map(feedback -> {
                    FeedbackDTO dto = new FeedbackDTO();
                    dto.setId(feedback.getId());
                    dto.setUsername(feedback.getUser().getUsername());
                    dto.setCourseName(feedback.getCourse().getTitle());
                    dto.setRating(feedback.getRating());
                    dto.setComments(feedback.getComments());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}