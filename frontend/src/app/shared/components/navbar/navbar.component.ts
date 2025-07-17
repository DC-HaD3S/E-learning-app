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
<<<<<<< HEAD
  isMobileMenuOpen = false;
  isUserDropdownOpen = false;
=======
    isMobileMenuOpen = false;
    isUserDropdownOpen = false;
>>>>>>> 021d21d09be0e45787db2f30ea72e3cbd2909662

  isAuthenticated$: Observable<boolean>;
  role$: Observable<UserRole | null>;
  username$: Observable<string>;

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
    this.isUserDropdownOpen = false;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.isUserDropdownOpen = false;
<<<<<<< HEAD
=======
  }

  toggleUserDropdown(): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
>>>>>>> 021d21d09be0e45787db2f30ea72e3cbd2909662
  }

    toggleUserDropdown(): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }
  
  // Close menus when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
<<<<<<< HEAD
    const navbar = target.closest('.navbar');
    const dropdown = target.closest('.dropdown');
=======
    const mobileMenuContainer = target.closest('.mobile-nav-container');
    const userDropdown = target.closest('.nav-item.dropdown');
>>>>>>> 021d21d09be0e45787db2f30ea72e3cbd2909662
    
    if (!navbar) {
      this.closeMobileMenu();
    }
    
<<<<<<< HEAD
    if (!dropdown && this.isUserDropdownOpen) {
=======
    if (!userDropdown && this.isUserDropdownOpen) {
>>>>>>> 021d21d09be0e45787db2f30ea72e3cbd2909662
      this.isUserDropdownOpen = false;
    }
  }

  // Close mobile menu on window resize (when switching to desktop)
  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    if (window.innerWidth > 767) { // Bootstrap md breakpoint
      this.closeMobileMenu();
    }
  }

  // Close mobile menu on escape key
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