
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, take, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.services';
import { UserRole } from '../enums/user-role.enum';
import { AppState } from '../state/app.state';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const expectedRole = route.data?.['role'] as UserRole | undefined;
    console.log('AuthGuard: Expected role:', expectedRole);

    if (!expectedRole) {
      console.error('AuthGuard: No role specified in route data');
      this.router.navigate(['/login']);
      return of(false);
    }

    return this.store.select(state => state.auth?.role).pipe(
      take(1),
      map(role => {
        console.log('AuthGuard: User role:', role, 'Logged in:', this.authService.isLoggedIn()); 
        if (!this.authService.isLoggedIn()) {
          console.warn('AuthGuard: User not logged in');
          this.router.navigate(['/login']);
          return false;
        }
        if (role !== expectedRole) {
          console.warn(`AuthGuard: Role mismatch: expected ${expectedRole}, got ${role}`);
          this.router.navigate(['/home']); 
          return false;
        }
        console.log('AuthGuard: Access granted');
        return true;
      }),
      catchError(err => {
        console.error('AuthGuard: Error checking auth state:', err);
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}