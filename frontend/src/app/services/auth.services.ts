import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { setRole, clearRole, setUserDetails } from '../state/auth.actions';
import { UserRole } from '../enums/user-role.enum';

export interface UserDetails {
  id: number;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8084/auth';

  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  initializeApp(): void {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      const role = decoded.role ? decoded.role.replace('ROLE_', '').toLowerCase() : 'user';
      const userDetails = {
        id: decoded.sub ? parseInt(decoded.sub, 10) : 0,
        email: decoded.email || ''
      };
      this.store.dispatch(setRole({ role: role as UserRole }));
      this.store.dispatch(setUserDetails({ userDetails }));
    }
  }

  login(username: string, password: string): Observable<string> {
    const body = { username, password };
    return this.http.post<{ jwt: string }>(`${this.apiUrl}/login`, body).pipe(
      map(response => {
        localStorage.setItem('token', response.jwt);
        const decoded = this.decodeToken(response.jwt);
        const role = decoded.role ? decoded.role.replace('ROLE_', '').toLowerCase() : 'user';
        const userDetails = {
          id: decoded.sub ? parseInt(decoded.sub, 10) : 0,
          email: decoded.email || ''
        };
        this.store.dispatch(setRole({ role: role as UserRole }));
        this.store.dispatch(setUserDetails({ userDetails }));
        return response.jwt;
      }),
      catchError(err => {
        console.error('Login error:', err);
        return throwError(() => new Error('Login failed. Please check your credentials.'));
      })
    );
  }

  signup(name: string, email: string, username: string, password: string, role: string = 'USER'): Observable<string> {
    const body = { name, email, username, password, role };
    return this.http.post<string>(`${this.apiUrl}/signup`, body, { responseType: 'text' as 'json' }).pipe(
      tap(() => {
        this.store.dispatch(clearRole());
        this.store.dispatch(setUserDetails({ userDetails: null }));
      }),
      catchError(err => {
        console.error('Signup error:', err);
        const errorMessage = err.error || 'Signup failed. Please try again.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  checkUsername(username: string): Observable<boolean> {
    return this.http.get<string>(`${this.apiUrl}/check-username?username=${username}`).pipe(
      map(response => response === 'Username is available'),
      catchError(err => {
        console.error('Check username error:', err);
        return throwError(() => new Error('Error checking username availability'));
      })
    );
  }

  checkEmail(email: string): Observable<boolean> {
    return this.http.get<string>(`${this.apiUrl}/check-email?email=${email}`).pipe(
      map(response => response === 'Email is available'),
      catchError(err => {
        console.error('Check email error:', err);
        return throwError(() => new Error('Error checking email availability'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.store.dispatch(clearRole());
    this.store.dispatch(setUserDetails({ userDetails: null }));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Error decoding JWT token:', e);
      return {};
    }
  }
}