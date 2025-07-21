import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseContent, TopicUpdate, SubtopicUpdate } from '../models/course-content.model';
import { environment } from 'src/environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CourseContentService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  // Get all topics and subtopics for a course
  getCourseContent(courseId: number): Observable<CourseContent[]> {
    return this.http.get<CourseContent[]>(`${this.apiUrl}/${courseId}/topic`);
  }

  // Add new topics with subtopics to a course
  addTopics(courseId: number, contentDTOs: CourseContent[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/topic`, contentDTOs);
  }

  // Update a topic name
  updateTopic(courseId: number, topicId: number, topicData: TopicUpdate): Observable<any> {
    return this.http.put(`${this.apiUrl}/${courseId}/topic/${topicId}`, topicData);
  }

  // Delete a topic (and all its subtopics)
  deleteTopic(courseId: number, topicId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${courseId}/topic/${topicId}`);
  }

  // Add a subtopic to a topic
  addSubtopic(courseId: number, topicId: number, subtopicData: SubtopicUpdate): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/topic/${topicId}/subtopic`, subtopicData);
  }

  // Update a subtopic
  updateSubtopic(courseId: number, topicId: number, subtopicId: number, subtopicData: SubtopicUpdate): Observable<any> {
    return this.http.put(`${this.apiUrl}/${courseId}/topic/${topicId}/subtopic/${subtopicId}`, subtopicData);
  }

  // Delete a subtopic
  deleteSubtopic(courseId: number, topicId: number, subtopicId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${courseId}/topic/${topicId}/subtopic/${subtopicId}`);
  }
}