import { Injectable } from '@angular/core';
import {  ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private store: Store<{ auth: { role: string | null } }>,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.store.select(state => state.auth.role).pipe(
      map(role => {
        const expectedRole = route.data['role'];
        if (role === expectedRole) {
          return true;
        }
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}