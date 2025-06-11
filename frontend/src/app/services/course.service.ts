import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Course } from '../models/course.model';
import { Enrollment } from '../models/enrollment.model';


@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8084';

  constructor(private http: HttpClient) {}

  private getHeaders(requireAuth: boolean = true): HttpHeaders {
    if (!requireAuth) {
      return new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    const token = localStorage.getItem('token');
    console.log('JWT Token:', token);
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`, { headers: this.getHeaders(false) })
      .pipe(
        map(courses => {
          console.log('API Response:', courses);
          return courses || [];
        }),
        catchError(error => {
          console.error('API Error:', error.status, error.message, error.error);
          return of([]);
        })
      );
  }
  
  getAdminCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/admin/courses`, { headers: this.getHeaders() })
      .pipe(
        map(courses => courses || []),
        catchError(error => {
          console.error('API Error:', error);
          return of([]);
        })
      );
  }

  enrollUser(username: string, courseId: number, courseName: string): Observable<string> {
    const enrollmentDTO = { username, courseId, courseName };
    return this.http.post<{ status: number, body: string }>(`${this.apiUrl}/enrollments/apply`, enrollmentDTO, { headers: this.getHeaders() })
      .pipe(map(response => response.body));
  }

  getEnrollments(userId: number): Observable<Enrollment[]> {
    return this.http.get<{ status: number, body: Enrollment[] }>(`${this.apiUrl}/enrollments/${userId}`, { headers: this.getHeaders() })
      .pipe(map(response => response.body || []));
  }

  addCourse(course: Course): Observable<string> {
    return this.http.post<{ status: number, body: string }>(`${this.apiUrl}/admin/courses`, course, { headers: this.getHeaders() })
      .pipe(map(response => response.body));
  }

  updateCourse(course: Course): Observable<string> {
    const url = `${this.apiUrl}/admin/courses/${course.id}`;
    return this.http.put<{ status: number, body: string }>(url, course, { headers: this.getHeaders() })
      .pipe(map(response => response.body));
  }

  deleteCourse(courseId: number): Observable<string> {
    const url = `${this.apiUrl}/admin/courses/${courseId}`;
    return this.http.delete<{ status: number, body: string }>(url, { headers: this.getHeaders() })
      .pipe(map(response => response.body));
  }
}