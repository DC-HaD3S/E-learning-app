import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserRole } from '../../enums/user-role.enum';
import { clearRole } from '../../state/auth.actions';
import { MatMenuTrigger } from '@angular/material/menu';
import { AppState } from '../../state/app.state';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit {
  role$: Observable<UserRole | null>;

  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  @ViewChild('triggerButton') triggerButton!: ElementRef<HTMLButtonElement>;

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    this.role$ = this.store.select(state => state.auth.role);
  }

  ngAfterViewInit(): void {
    if (!this.menuTrigger) {
      console.warn('MatMenuTrigger is not available');
    }
    if (!this.triggerButton) {
      console.warn('Trigger button is not available');
    }
    this.menuTrigger?.menuOpened.subscribe(() => this.adjustMenuWidth());
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

  goToAdminInstructors(): void {
    this.router.navigate(['/admin/instructors']);
  }

  goToAdminEnrolled(): void {
    this.router.navigate(['/admin/enrolled']);
  }

  goToAdminManageCourses(): void {
    this.router.navigate(['/admin/manage-houses']);
  }



  goToUserApplyInstructor(): void {
    this.router.navigate(['/user/apply-instructor']);
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
  localStorage.removeItem('role');
  this.router.navigate(['/login']);
}

  adjustMenuWidth(): void {
    const buttonWidth = this.triggerButton?.nativeElement?.offsetWidth;
    const menuPanelEl = (this.menuTrigger as any)._overlayRef?.overlayElement;
    if (buttonWidth && menuPanelEl) {
      menuPanelEl.style.width = `${buttonWidth}px`;
    } else {
      console.warn('Could not adjust menu width: overlay panel or button width is unavailable');
    }
  }
}