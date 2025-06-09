import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.services';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-apply-instructor',
  templateUrl: './apply-instructor.component.html',
  styleUrls: ['./apply-instructor.component.css']
})
export class ApplyInstructorComponent {
  instructorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.instructorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      qualifications: ['', [Validators.required, Validators.minLength(10)]],
      yearsOfExperience: [0, [Validators.required, Validators.min(0)]],
      confirmation: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.instructorForm.valid) {
      console.log('Instructor application submitted:', this.instructorForm.value);
      this.snackBar.open('✅ Application submitted successfully!', 'Close', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: ['custom-snackbar']
      });
      this.instructorForm.reset();
      setTimeout(() => {
        this.router.navigate(['/user/home']);
      }, 2000);
    }
  }
}