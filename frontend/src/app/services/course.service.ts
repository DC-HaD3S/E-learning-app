import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
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
    if (!token && requireAuth) {
      console.warn('No JWT token found for authenticated request');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`, { headers: this.getHeaders(false) })
      .pipe(
        map(courses => {
          console.log('Courses API Response:', courses);
          return courses || [];
        }),
        catchError(error => {
          console.error('Courses API Error:', {
            status: error.status,
            message: error.message,
            error: error.error
          });
          return of([]);
        })
      );
  }

  getAdminCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/admin/courses`, { headers: this.getHeaders() })
      .pipe(
        map(courses => courses || []),
        catchError(error => {
          console.error('Admin Courses API Error:', {
            status: error.status,
            message: error.message,
            error: error.error
          });
          return of([]);
        })
      );
  }

  addCourse(course: Course): Observable<{ message: string, data: Course }> {
    return this.http.post<{ message: string, data: Course }>(`${this.apiUrl}/admin/courses`, course, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          console.log('Add Course API Response:', response);
          return response;
        }),
        catchError(error => {
          console.error('Add Course API Error:', {
            status: error.status,
            message: error.message,
            error: error.error
          });
          return throwError(() => new Error(error.error?.message || 'Failed to add course'));
        })
      );
  }

  updateCourse(course: Course): Observable<{ message: string, data: Course }> {
    return this.http.put(`${this.apiUrl}/admin/courses/${course.id}`, course, { headers: this.getHeaders(), responseType: 'text' })
      .pipe(
        map(response => {
          console.log('Update Course API Response:', response);
          return { message: response, data: course };
        }),
        catchError(error => {
          console.error('Update Course API Error:', {
            status: error.status,
            message: error.message,
            error: error.error
          });
          return throwError(() => new Error(error.error?.message || 'Failed to update course'));
        })
      );
  }

  deleteCourse(courseId: number): Observable<{ message: string, data: null }> {
    return this.http.delete<{ message: string, data: null }>(`${this.apiUrl}/admin/courses/${courseId}`, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          console.log('Delete Course API Response:', response);
          return response;
        }),
        catchError(error => {
          console.error('Delete Course API Error:', {
            status: error.status,
            message: error.message,
            error: error.error
          });
          return throwError(() => new Error(error.error?.message || 'Failed to delete course'));
        })
      );
  }

  enrollUser(username: string, courseId: number, courseName: string): Observable<{ message: string, data: Enrollment }> {
    const enrollmentDTO = { username, courseId, courseName };
    return this.http.post<{ message: string, data: Enrollment }>(`${this.apiUrl}/enrollments/apply`, enrollmentDTO, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          console.log('Enroll User API Response:', response);
          return response;
        }),
        catchError(error => {
          console.error('Enroll API Error:', {
            status: error.status,
            message: error.message,
            error: error.error
          });
          return throwError(() => new Error(error.error?.message || 'Enrollment failed'));
        })
      );
  }

  getEnrollments(userId: string): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/enrollments/${userId}`, { headers: this.getHeaders() })
      .pipe(
        map(enrollments => {
          console.log('Enrollments API Response:', enrollments);
          return enrollments || [];
        }),
        catchError(error => {
          console.error('Enrollments API Error:', {
            status: error.status,
            message: error.message,
            error: error.error
          });
          return of([]);
        })
      );
  }
}