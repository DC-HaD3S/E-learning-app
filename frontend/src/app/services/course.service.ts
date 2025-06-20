import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Course } from '../models/course.model';
import { Enrollment } from '../models/enrollment.model';
import { AuthService } from './auth.services';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8084';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    // Only set Content-Type; Authorization is handled by AuthInterceptor
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`, { headers: this.getHeaders() }).pipe(
      map(courses => courses || []),
      catchError(error => {
        console.error('Courses API Error:', { status: error.status, message: error.message, error: error.error });
        this.snackBar.open(`Error fetching courses: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
        return throwError(() => new Error(error.error?.message || 'Failed to fetch courses'));
      })
    );
  }

  addCourse(course: Course): Observable<{ message: string, data: Course }> {
    return this.authService.isAuthenticated$().pipe(
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          this.snackBar.open('Please log in to add a course.', 'Close', { duration: 5000 });
          return throwError(() => new Error('User not authenticated'));
        }
        return this.http.post<{ message: string, data: Course }>(`${this.apiUrl}/admin/courses`, course, { headers: this.getHeaders() }).pipe(
          map(response => response),
          catchError(error => {
            console.error('Add Course API Error:', { status: error.status, message: error.message, error: error.error });
            this.snackBar.open(`Error adding course: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
            return throwError(() => new Error(error.error?.message || 'Failed to add course'));
          })
        );
      })
    );
  }

  updateCourse(course: Course): Observable<{ message: string, data: Course }> {
    return this.authService.isAuthenticated$().pipe(
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          this.snackBar.open('Please log in to update a course.', 'Close', { duration: 5000 });
          return throwError(() => new Error('User not authenticated'));
        }
        return this.http.put<{ message: string, data: Course }>(`${this.apiUrl}/admin/courses/${course.id}`, course, { headers: this.getHeaders() }).pipe(
          map(response => response),
          catchError(error => {
            console.error('Update Course API Error:', { status: error.status, message: error.message, error: error.error });
            this.snackBar.open(`Error updating course: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
            return throwError(() => new Error(error.error?.message || 'Failed to update course'));
          })
        );
      })
    );
  }

  deleteCourse(courseId: number): Observable<{ message: string, data: null }> {
    return this.authService.isAuthenticated$().pipe(
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          this.snackBar.open('Please log in to delete a course.', 'Close', { duration: 5000 });
          return throwError(() => new Error('User not authenticated'));
        }
        return this.http.delete<{ message: string, data: null }>(`${this.apiUrl}/admin/courses/${courseId}`, { headers: this.getHeaders() }).pipe(
          map(response => response),
          catchError(error => {
            console.error('Delete Course API Error:', { status: error.status, message: error.message, error: error.error });
            this.snackBar.open(`Error deleting course: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
            return throwError(() => new Error(error.error?.message || 'Failed to delete course'));
          })
        );
      })
    );
  }

  enrollUser(courseId: number, courseName: string): Observable<{ message: string }> {
    return this.authService.isAuthenticated$().pipe(
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          this.snackBar.open('Please log in to enroll.', 'Close', { duration: 5000 });
          return throwError(() => new Error('User not authenticated'));
        }
        const username = this.authService.getUsername();
        if (!username) {
          this.snackBar.open('User information not available.', 'Close', { duration: 5000 });
          return throwError(() => new Error('User not authenticated'));
        }
        const enrollmentDTO = { username, courseId, courseName };
        return this.http.post<{ message: string }>(`${this.apiUrl}/user/apply-course`, enrollmentDTO, { headers: this.getHeaders() }).pipe(
          map(response => response),
          catchError(error => {
            console.error('Enroll API Error:', {
              status: error.status,
              message: error.message,
              error: error.error,
              url: error.url
            });
            let errorMessage = 'Failed to enroll';
            if (error.status === 403) {
              errorMessage = 'Access denied: Please check your login status or permissions.';
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            }
            this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
            return throwError(() => new Error(errorMessage));
          })
        );
      })
    );
  }

  getEnrolledCourses(): Observable<Enrollment[]> {
  console.log('getEnrolledCourses called'); // Debug log
  return this.authService.isAuthenticated$().pipe(
    switchMap(isAuthenticated => {
      if (!isAuthenticated) {
        return of([]);
      }
      console.log('CourseService: Making HTTP call to /user/enrolled-courses');
      const headers = this.getHeaders();
      console.log('Headers:', headers); // Debug token
      return this.http.get<Enrollment[]>(`${this.apiUrl}/user/enrolled-courses`, { headers }).pipe(
        map(enrollments => enrollments.map(enrollment => ({
          username: enrollment.username || '',
          courseId: Number(enrollment.courseId) || 0,
          courseName: enrollment.courseName || ''
        })) || []),
        catchError(error => {
          console.error('Enrolled Courses API Error:', {
            status: error.status,
            message: error.message,
            error: error.error
          });
          if (error.status === 403) {
            console.log('CourseService: 403 error, likely invalid token'); // Debug log
            this.snackBar.open('Access denied: Please log in.', 'Close', { duration: 5000 });
          }
          return of([]);
        })
      );
    })
  );
}
}