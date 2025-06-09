import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  username: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    const newUser = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password,
      role: 'user' // Default role for new users
    };

    this.http.post('http://localhost:8000/users', newUser).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Signup failed. Please try again.';
        console.error('Signup error:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/login']);
  }
}