
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { InstructorDetails } from '../models/instructor-details.model';
import { environment } from 'src/environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private apiUrl = `${environment.apiUrl}/instructor`;

  constructor(private http: HttpClient) {
  }

  getInstructorDetails(instructorId: number): Observable<InstructorDetails> {
    const url = `${this.apiUrl}/${instructorId}`;
    return this.http.get<InstructorDetails>(url).pipe(
      map(details => {
        if (details.photoUrl && details.photoUrl.includes('drive.google.com')) {
          details.photoUrl = `${this.apiUrl}/proxy-image?url=${encodeURIComponent(details.photoUrl)}`;
        }
        return details;
      }),
      catchError(this.handleError)
    );
  }

  getInstructorAverageRating(instructorId: number): Observable<number | null> {
    const url = `${this.apiUrl}/average-rating?instructorId=${instructorId}`;
    return this.http.get<{ instructorId: number, averageRating: number | null, message: string }>(url).pipe(
      map(response => {
        return response.averageRating;
      }),
      catchError(err => {
        if (err.status === 400 && 
            (err.error?.message?.includes('No ratings found') || 
             err.error?.message?.includes('User is not an instructor'))) {
          return of(null);
        }
        return this.handleError(err);
      })
    );
  }

  getEnrollmentCount(instructorId: number): Observable<number> {
    const url = `${this.apiUrl}/${instructorId}/enrollment-count`;
    return this.http.get<number>(url).pipe(
      catchError(err => {
        if (err.status === 400 && 
            err.error?.message?.includes('User is not an instructor')) {
          return of(0);
        }
        return this.handleError(err);
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} - ${error.error?.message || error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}