import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8000/courses';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  enrollUser(courseId: number, userId: number): Observable<boolean> {
    const url = `${this.apiUrl}/${courseId}/enroll`;
    return this.http.post<boolean>(url, { userId });
  }

  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  updateCourse(course: Course): Observable<Course> {
    const url = `${this.apiUrl}/${course.id}`;
    return this.http.put<Course>(url, course);
  }

  deleteCourse(courseId: number): Observable<void> {
    const url = `${this.apiUrl}/${courseId}`;
    return this.http.delete<void>(url);
  }
}