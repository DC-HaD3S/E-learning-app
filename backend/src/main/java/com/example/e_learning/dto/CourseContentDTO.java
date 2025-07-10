package com.example.e_learning.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Map;

public class CourseContentDTO {

    @Schema(description = "The main topic of the course content", example = "Introduction to Java")
    private String topic;

    @Schema(description = "Subtopics under the main topic, each with a name and URL", 
            example = "{\"subtopicOne\": {\"name\": \"Variables\", \"url\": \"http://example.com/variables\"}, \"subtopicTwo\": {\"name\": \"Data Types\", \"url\": \"http://example.com/datatypes\"}, \"subtopicThree\": {\"name\": \"Control Structures\", \"url\": \"http://example.com/control\"}}")
    private Map<String, Subtopic> subtopics;

    public static class Subtopic {
        @Schema(description = "Name of the subtopic", example = "Variables")
        private String name;

        @Schema(description = "URL for the subtopic", example = "http://example.com/variables")
        private String url;

        // Getters and setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }

    // Getters and setters
    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public Map<String, Subtopic> getSubtopics() {
        return subtopics;
    }

    public void setSubtopics(Map<String, Subtopic> subtopics) {
        this.subtopics = subtopics;
    }
}