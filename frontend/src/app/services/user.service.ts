import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../models/user.model';
import { UserRole } from '../enums/user-role.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8084/admin/users'; 

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No JWT token found for authenticated request');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

getAllUsers(): Observable<User[]> {
  return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
    map(users => users.map(user => ({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      username: user.username || user.sub || '',
      role: (user.role?.replace('ROLE_', '').toLowerCase() || 'user') as UserRole,
      password: user.password || ''
    }))),
    map(users => {
      return users || [];
    }),
    catchError(error => {
      const errorMessage = error.status === 401 || error.status === 403
        ? 'Unauthorized: Please log in as an admin.'
        : `Error fetching users: ${error.error?.message || 'Unknown error'}`;
      this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
      return throwError(() => new Error(errorMessage));
    })
  );
}
}