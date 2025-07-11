package com.example.e_learning.dto;

import java.util.List;

public class CourseContentDTO {
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	private String topic;
	private List<Subtopic> subtopics;

	public static class Subtopic {
		private Long id;
		private String name;
		private String url;

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

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

	public List<Subtopic> getSubtopics() {
		return subtopics;
	}

	public void setSubtopics(List<Subtopic> subtopics) {
		this.subtopics = subtopics;
	}
}