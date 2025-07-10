package com.example.e_learning.service;

import com.example.e_learning.dto.CourseContentDTO;
import com.example.e_learning.entity.Course;
import com.example.e_learning.entity.CourseContent;
import com.example.e_learning.entity.User;
import com.example.e_learning.repository.CourseContentRepository;
import com.example.e_learning.repository.CourseRepository;
import com.example.e_learning.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CourseContentService {

    private final CourseContentRepository courseContentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public CourseContentService(CourseContentRepository courseContentRepository,
                                CourseRepository courseRepository,
                                UserRepository userRepository) {
        this.courseContentRepository = courseContentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    public List<CourseContentDTO> getAllCourseContent() {
        List<CourseContent> contents = courseContentRepository.findAll();
        return contents.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<CourseContentDTO> getCourseContentByCourseId(Long courseId) {
        List<CourseContent> contents = courseContentRepository.findByCourseId(courseId);
        return contents.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public List<CourseContent> createCourseContent(Long courseId, List<CourseContentDTO> dtos) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!user.getRole().equals("ADMIN") && !user.getRole().equals("INSTRUCTOR")) {
            throw new IllegalStateException("Only admins and instructors can create course content");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        // Admins can create content for any course; instructors only for their own
        if (!user.getRole().equals("ADMIN") && 
            (course.getInstructor() == null || !course.getInstructor().getId().equals(user.getId()))) {
            throw new IllegalStateException("Instructors can only add content to their own courses");
        }

        return dtos.stream().map(dto -> {
            CourseContent content = new CourseContent();
            content.setTopic(dto.getTopic());
            CourseContentDTO.Subtopic subtopicOne = dto.getSubtopics().get("subtopicOne");
            content.setSubtopicOne(subtopicOne != null ? subtopicOne.getName() : null);
            content.setSubtopicOneUrl(subtopicOne != null ? subtopicOne.getUrl() : null);
            CourseContentDTO.Subtopic subtopicTwo = dto.getSubtopics().get("subtopicTwo");
            content.setSubtopicTwo(subtopicTwo != null ? subtopicTwo.getName() : null);
            content.setSubtopicTwoUrl(subtopicTwo != null ? subtopicTwo.getUrl() : null);
            CourseContentDTO.Subtopic subtopicThree = dto.getSubtopics().get("subtopicThree");
            content.setSubtopicThree(subtopicThree != null ? subtopicThree.getName() : null);
            content.setSubtopicThreeUrl(subtopicThree != null ? subtopicThree.getUrl() : null);
            content.setCourse(course);
            content.setInstructor(user.getRole().equals("ADMIN") ? null : user);
            return courseContentRepository.save(content);
        }).collect(Collectors.toList());
    }

    @Transactional
    public void updateCourseContent(Long contentId, CourseContentDTO dto) {
        CourseContent content = courseContentRepository.findById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("Course content not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Admins can update any content; instructors only their own
        if (!user.getRole().equals("ADMIN") && 
            (content.getInstructor() == null || !content.getInstructor().getId().equals(user.getId()))) {
            throw new IllegalStateException("Instructors can only update their own course content");
        }

        content.setTopic(dto.getTopic());
        CourseContentDTO.Subtopic subtopicOne = dto.getSubtopics().get("subtopicOne");
        content.setSubtopicOne(subtopicOne != null ? subtopicOne.getName() : null);
        content.setSubtopicOneUrl(subtopicOne != null ? subtopicOne.getUrl() : null);
        CourseContentDTO.Subtopic subtopicTwo = dto.getSubtopics().get("subtopicTwo");
        content.setSubtopicTwo(subtopicTwo != null ? subtopicTwo.getName() : null);
        content.setSubtopicTwoUrl(subtopicTwo != null ? subtopicTwo.getUrl() : null);
        CourseContentDTO.Subtopic subtopicThree = dto.getSubtopics().get("subtopicThree");
        content.setSubtopicThree(subtopicThree != null ? subtopicThree.getName() : null);
        content.setSubtopicThreeUrl(subtopicThree != null ? subtopicThree.getUrl() : null);
        content.setInstructor(user.getRole().equals("ADMIN") ? null : user);

        courseContentRepository.save(content);
    }

    @Transactional
    public void deleteCourseContent(Long contentId) {
        CourseContent content = courseContentRepository.findById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("Course content not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Admins can delete any content; instructors only their own
        if (!user.getRole().equals("ADMIN") && 
            (content.getInstructor() == null || !content.getInstructor().getId().equals(user.getId()))) {
            throw new IllegalStateException("Instructors can only delete their own course content");
        }

        courseContentRepository.deleteById(contentId);
    }

    private CourseContentDTO convertToDTO(CourseContent content) {
        CourseContentDTO dto = new CourseContentDTO();
        dto.setTopic(content.getTopic());
        dto.setSubtopics(Map.of(
            "subtopicOne", new CourseContentDTO.Subtopic() {{
                setName(content.getSubtopicOne() != null ? content.getSubtopicOne() : "");
                setUrl(content.getSubtopicOneUrl() != null ? content.getSubtopicOneUrl() : "");
            }},
            "subtopicTwo", new CourseContentDTO.Subtopic() {{
                setName(content.getSubtopicTwo() != null ? content.getSubtopicTwo() : "");
                setUrl(content.getSubtopicTwoUrl() != null ? content.getSubtopicTwoUrl() : "");
            }},
            "subtopicThree", new CourseContentDTO.Subtopic() {{
                setName(content.getSubtopicThree() != null ? content.getSubtopicThree() : "");
                setUrl(content.getSubtopicThreeUrl() != null ? content.getSubtopicThreeUrl() : "");
            }}
        ));
        return dto;
    }
}