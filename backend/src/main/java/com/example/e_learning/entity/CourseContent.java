package com.example.e_learning.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "course_content")
public class CourseContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String topic;

    @Column(name = "subtopic_one")
    private String subtopicOne;

    @Column(name = "subtopic_one_url")
    private String subtopicOneUrl;

    @Column(name = "subtopic_two")
    private String subtopicTwo;

    @Column(name = "subtopic_two_url")
    private String subtopicTwoUrl;

    @Column(name = "subtopic_three")
    private String subtopicThree;

    @Column(name = "subtopic_three_url")
    private String subtopicThreeUrl;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "instructor_id", nullable = true)
    private User instructor;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getSubtopicOne() {
        return subtopicOne;
    }

    public void setSubtopicOne(String subtopicOne) {
        this.subtopicOne = subtopicOne;
    }

    public String getSubtopicOneUrl() {
        return subtopicOneUrl;
    }

    public void setSubtopicOneUrl(String subtopicOneUrl) {
        this.subtopicOneUrl = subtopicOneUrl;
    }

    public String getSubtopicTwo() {
        return subtopicTwo;
    }

    public void setSubtopicTwo(String subtopicTwo) {
        this.subtopicTwo = subtopicTwo;
    }

    public String getSubtopicTwoUrl() {
        return subtopicTwoUrl;
    }

    public void setSubtopicTwoUrl(String subtopicTwoUrl) {
        this.subtopicTwoUrl = subtopicTwoUrl;
    }

    public String getSubtopicThree() {
        return subtopicThree;
    }

    public void setSubtopicThree(String subtopicThree) {
        this.subtopicThree = subtopicThree;
    }

    public String getSubtopicThreeUrl() {
        return subtopicThreeUrl;
    }

    public void setSubtopicThreeUrl(String subtopicThreeUrl) {
        this.subtopicThreeUrl = subtopicThreeUrl;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public User getInstructor() {
        return instructor;
    }

    public void setInstructor(User instructor) {
        this.instructor = instructor;
    }
}