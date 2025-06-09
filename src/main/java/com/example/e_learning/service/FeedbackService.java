
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

    public void submitFeedback(FeedbackDTO feedbackDTO, String principalUsername) {
        if (!feedbackDTO.getUsername().equals(principalUsername)) {
            throw new IllegalArgumentException("Feedback username must match authenticated user");
        }
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

    public List<FeedbackDTO> getAllFeedbacks() {
        return feedbackRepository.findAll().stream()
                .map(feedback -> {
                    FeedbackDTO dto = new FeedbackDTO();
                    dto.setUsername(feedback.getUser().getUsername());
                    dto.setCourseName(feedback.getCourse().getTitle());
                    dto.setRating(feedback.getRating());
                    dto.setComments(feedback.getComments());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
