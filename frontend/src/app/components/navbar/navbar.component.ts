import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserRole } from '../../enums/user-role.enum';
import { clearRole } from '../../state/auth.actions';
import { AppState } from '../../state/app.state';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  role$: Observable<UserRole | null>;

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    this.role$ = this.store.select(state => state.auth.role);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToAdminHome(): void {
    this.router.navigate(['/admin/home']);
  }

  goToAdminFeedbacks(): void {
    this.router.navigate(['/admin/feedbacks']);
  }

goToAboutUs():void{
  this.router.navigate(['/user/about-us'])
}

  goToAdminEnrolled(): void {
    this.router.navigate(['/admin/enrolled']);
  }

  goToAdminManageCourses(): void {
    this.router.navigate(['/admin/manage-courses']);
  }


  goToUserFeedback(): void {
    this.router.navigate(['/user/feedback']);
  }

  goToRegisteredUsers(): void {
    this.router.navigate(['/admin/registered-users']);
  }

  goToUserEnrolled(): void {
    this.router.navigate(['/user/enrolled']);
  }

  logout(): void {
    this.store.dispatch(clearRole());
    localStorage.removeItem('token'); 
    this.router.navigate(['/login']);
  }
}