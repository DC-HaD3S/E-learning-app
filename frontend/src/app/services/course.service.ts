import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Course } from '../models/course.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    private apiUrl = 'http://localhost:8084';

    constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        console.log('JWT Token:', token);
        if (!token) {
            console.warn('No JWT token found for authenticated request');
        }
        return new HttpHeaders({
            'Authorization': `Bearer ${token || ''}`,
            'Content-Type': 'application/json'
        });
    }

    getCourses(): Observable<Course[]> {
        console.log('Fetching courses from:', `${this.apiUrl}/courses`);
        return this.http.get<Course[]>(`${this.apiUrl}/courses`, { headers: this.getHeaders() })
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
                    this.snackBar.open(`Error fetching courses: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
                    return throwError(() => new Error(error.error?.message || 'Failed to fetch courses'));
                })
            );
    }

    addCourse(course: Course): Observable<{ message: string, data: Course }> {
        console.log('Adding course:', course);
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
                    this.snackBar.open(`Error adding course: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
                    return throwError(() => new Error(error.error?.message || 'Failed to add course'));
                })
            );
    }

    updateCourse(course: Course): Observable<{ message: string, data: Course }> {
        console.log('Updating course:', {
            url: `${this.apiUrl}/admin/courses/${course.id}`,
            course: course
        });
        return this.http.put<{ message: string }>(`${this.apiUrl}/admin/courses/${course.id}`, course, { headers: this.getHeaders() })
            .pipe(
                map(response => {
                    console.log('Update Course API Response:', response);
                    return { message: response.message, data: course };
                }),
                catchError(error => {
                    console.error('Update Course API Error:', {
                        status: error.status,
                        message: error.message,
                        error: error.error
                    });
                    this.snackBar.open(`Error updating course: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
                    return throwError(() => new Error(error.error?.message || 'Failed to update course'));
                })
            );
    }

    deleteCourse(courseId: number): Observable<{ message: string, data: null }> {
        console.log('Deleting course ID:', courseId);
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
                    this.snackBar.open(`Error deleting course: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
                    return throwError(() => new Error(error.error?.message || 'Failed to delete course'));
                })
            );
    }

    enrollUser(username: string, courseId: number, courseName: string): Observable<{ message: string }> {
        const enrollmentDTO = { username, courseId };
        console.log('Enrolling user:', enrollmentDTO);
        return this.http.post<{ message: string }>(`${this.apiUrl}/enrollments/apply`, enrollmentDTO, { headers: this.getHeaders() })
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
                    this.snackBar.open(`Error enrolling user: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
                    return throwError(() => new Error(error.error?.message || 'Failed to enroll user'));
                })
            );
    }
}