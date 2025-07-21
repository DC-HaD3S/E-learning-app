import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InstructorApplication, Instructor } from '../models/instructor-application.model';
import { environment } from 'src/environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  // Get all instructor applications (admin only)
  getInstructorApplications(): Observable<InstructorApplication[]> {
    return this.http.get<InstructorApplication[]>(`${this.apiUrl}/instructor/applications`).pipe(
      catchError(error => {
        console.error('Get Instructor Applications Error:', error);
        this.snackBar.open(`Error fetching applications: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
        return throwError(() => new Error(error.error?.message || 'Failed to fetch applications'));
      })
    );
  }

  // Submit instructor application
  submitApplication(application: Omit<InstructorApplication, 'id' | 'status' | 'appliedAt' | 'reviewedAt'>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/instructor/apply`, application).pipe(
      tap(() => {
        this.snackBar.open('Application submitted successfully!', 'Close', { duration: 5000 });
      }),
      catchError(error => {
        console.error('Submit Application Error:', error);
        this.snackBar.open(`Error submitting application: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
        return throwError(() => new Error(error.error?.message || 'Failed to submit application'));
      })
    );
  }

  // Approve application (admin only)
  approveApplication(applicationId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/instructor/approve?applicationId=${applicationId}`, {}).pipe(
      tap(() => {
        this.snackBar.open('Application approved successfully!', 'Close', { duration: 5000 });
      }),
      catchError(error => {
        console.error('Approve Application Error:', error);
        this.snackBar.open(`Error approving application: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
        return throwError(() => new Error(error.error?.message || 'Failed to approve application'));
      })
    );
  }

  // Get instructor profile by ID (using the correct backend endpoint)
  getInstructorById(instructorId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/instructor/${instructorId}`).pipe(
      catchError(error => {
        console.error('Get Instructor Error:', error);
        this.snackBar.open(`Error fetching instructor: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
        return throwError(() => new Error(error.error?.message || 'Failed to fetch instructor'));
      })
    );
  }

  // Get instructor profile by name (keeping for backward compatibility)
  getInstructorByName(name: string): Observable<Instructor> {
    return this.http.get<Instructor>(`${this.apiUrl}/instructors/${encodeURIComponent(name)}`).pipe(
      catchError(error => {
        console.error('Get Instructor Error:', error);
        this.snackBar.open(`Error fetching instructor: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
        return throwError(() => new Error(error.error?.message || 'Failed to fetch instructor'));
      })
    );
  }

  // Get all instructors
  getInstructors(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(`${this.apiUrl}/instructors`).pipe(
      catchError(error => {
        console.error('Get Instructors Error:', error);
        this.snackBar.open(`Error fetching instructors: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
        return throwError(() => new Error(error.error?.message || 'Failed to fetch instructors'));
      })
    );
  }

  // Update instructor profile using the backend endpoint
  updateInstructorDetails(instructorData: any): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/instructor`, instructorData).pipe(
      tap(() => {
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 5000 });
      }),
      catchError(error => {
        console.error('Update Instructor Error:', error);
        this.snackBar.open(`Error updating profile: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
        return throwError(() => new Error(error.error?.message || 'Failed to update profile'));
      })
    );
  }

  // Get instructor average rating
  getInstructorAverageRating(instructorId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/instructor/average-rating?instructorId=${instructorId}`).pipe(
      catchError(error => {
        console.error('Get Instructor Average Rating Error:', error);
        this.snackBar.open(`Error fetching average rating: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
        return throwError(() => new Error(error.error?.message || 'Failed to fetch average rating'));
      })
    );
  }

  // Get instructor enrollment count
  getInstructorEnrollmentCount(instructorId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/instructor/${instructorId}/enrollment-count`).pipe(
      catchError(error => {
        console.error('Get Instructor Enrollment Count Error:', error);
        this.snackBar.open(`Error fetching enrollment count: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
        return throwError(() => new Error(error.error?.message || 'Failed to fetch enrollment count'));
      })
    );
  }

  // Get instructor's highest enrolled courses
  getInstructorHighestEnrolledCourses(instructorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/instructor/${instructorId}/highest-enrolled-courses`).pipe(
      catchError(error => {
        console.error('Get Instructor Highest Enrolled Courses Error:', error);
        this.snackBar.open(`Error fetching highest enrolled courses: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
        return throwError(() => new Error(error.error?.message || 'Failed to fetch highest enrolled courses'));
      })
    );
  }
}