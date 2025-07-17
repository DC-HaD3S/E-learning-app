import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserRole } from '../../../enums/user-role.enum';
import { AppState } from '../../../store/app.state';
import { AuthService } from 'src/app/auth/auth.services';
import { clearRole, setUserDetails } from 'src/app/store/auth/auth.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMobileMenuOpen = false;
  isUserDropdownOpen = false;

  isAuthenticated$: Observable<boolean>;
  role$: Observable<UserRole | null>;
  username$: Observable<string>;

  screenWidth = window.innerWidth;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private authService: AuthService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$();
    this.role$ = this.store.select(state => state.auth.role);
    this.username$ = this.store.select(state => state.auth.user?.username).pipe(
      map(username => username || 'User')
    );
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.screenWidth >= 800) {
      this.isUserDropdownOpen = false;
    }
  }

  toggleUserDropdown(): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    if (this.screenWidth >= 800) {
      this.isUserDropdownOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const clickedInsideNavbar = target.closest('.navbar');
    const clickedInsideDropdown = target.closest('.dropdown');

    if (!clickedInsideNavbar) {
      this.closeMobileMenu();
    }

    if (!clickedInsideDropdown && this.isUserDropdownOpen && this.screenWidth >= 800) {
      this.isUserDropdownOpen = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth > 800) {
      this.closeMobileMenu();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(): void {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
    this.closeMobileMenu();
  }

  goToAboutUs(): void {
    this.router.navigate(['/about-us']);
    this.closeMobileMenu();
  }

  goToAdminFeedbacks(): void {
    this.checkAuthAndNavigate('/admin/feedbacks');
    this.closeMobileMenu();
  }

  goToAdminEnrolled(): void {
    this.checkAuthAndNavigate('/admin/enrolled');
    this.closeMobileMenu();
  }

  goToAdminManageCourses(): void {
    this.checkAuthAndNavigate('/admin/manage-courses');
    this.closeMobileMenu();
  }

  goToRegisteredUsers(): void {
    this.checkAuthAndNavigate('/admin/registered-users');
    this.closeMobileMenu();
  }

  goToUserEnrolled(): void {
    this.checkAuthAndNavigate('/user/enrolled');
    this.closeMobileMenu();
  }

  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
    this.router.navigate(['/login']).then(() => {
      this.store.dispatch(clearRole());
      this.store.dispatch(setUserDetails({ userDetails: null }));
    });
  }

  private checkAuthAndNavigate(path: string): void {
    this.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/login'], { queryParams: { returnUrl: path } });
          return;
        }
        this.router.navigate([path]);
      })
    ).subscribe();
  }
}
