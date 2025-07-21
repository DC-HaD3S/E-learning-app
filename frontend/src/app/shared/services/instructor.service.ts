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
    return this.http.get<InstructorApplication[]>(`${this.apiUrl}/instructor-applications`).pipe(
      catchError(error => {
        console.error('Get Instructor Applications Error:', error);
        this.snackBar.open(`Error fetching applications: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
        return throwError(() => new Error(error.error?.message || 'Failed to fetch applications'));
      })
    );
  }

  // Submit instructor application
  submitApplication(application: Omit<InstructorApplication, 'id' | 'status' | 'appliedAt' | 'reviewedAt'>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/instructor-applications`, application).pipe(
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

  // Approve/reject application (admin only)
  reviewApplication(applicationId: number, status: 'approved' | 'rejected'): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/instructor-applications/${applicationId}`, { status }).pipe(
      tap(() => {
        this.snackBar.open(`Application ${status} successfully!`, 'Close', { duration: 5000 });
      }),
      catchError(error => {
        console.error('Review Application Error:', error);
        this.snackBar.open(`Error reviewing application: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
        return throwError(() => new Error(error.error?.message || 'Failed to review application'));
      })
    );
  }

  // Get instructor profile by name
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

  // Update instructor profile
  updateInstructor(instructor: Instructor): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/instructors/${instructor.id}`, instructor).pipe(
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
}