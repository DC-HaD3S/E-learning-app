import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { InstructorDetails } from '../models/instructor-details.model';
import { environment } from 'src/environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private apiUrl = `${environment.apiUrl}/instructor`;

  constructor(private http: HttpClient) {
    console.log('API URL:', this.apiUrl);
  }

  getInstructorDetails(instructorId: number): Observable<InstructorDetails> {
    const url = `${this.apiUrl}/${instructorId}`;
    console.log('Fetching instructor details from:', url);
    return this.http.get<InstructorDetails>(url).pipe(
      catchError(this.handleError)
    );
  }

  getInstructorAverageRating(instructorId: number): Observable<number | null> {
    const url = `${this.apiUrl}/average-rating?instructorId=${instructorId}`;
    console.log('Fetching average rating from:', url);
    return this.http.get<{ instructorId: number, averageRating: number | null, message: string }>(url).pipe(
      map(response => response.averageRating),
      catchError(this.handleError)
    );
  }

  getEnrollmentCount(instructorId: number): Observable<number> {
    const url = `${this.apiUrl}/${instructorId}/enrollment-count`;
    console.log('Fetching enrollment count from:', url);
    return this.http.get<number>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} - ${error.error.error || error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}