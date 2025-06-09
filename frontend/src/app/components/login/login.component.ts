import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.services';
import { UserRole } from '../../enums/user-role.enum';
import { setRole } from '../../state/auth.actions';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private dialog: MatDialog
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    
    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        this.loading = false;
        if (success) {
          const role = this.username === 'admin' ? UserRole.Admin : UserRole.User;
          this.store.dispatch(setRole({ role }));
          localStorage.setItem('role', role);
          this.router.navigate([`/${role.toLowerCase()}/home`]);
        } else {
          this.error = 'Invalid username or password';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Login failed. Please try again.';
      }
    });
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    this.dialog.open(ForgotPasswordComponent, {
      width: '400px'
    });
  }

  onSignup(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/signup']);
  }
}