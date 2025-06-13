import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InstructorService, InstructorApplication } from 'src/app/services/instructor.service';
import { AuthService } from 'src/app/services/auth.services';

@Component({
  selector: 'app-apply-instructor',
  templateUrl: './apply-instructor.component.html',
  styleUrls: ['./apply-instructor.component.css']
})
export class ApplyInstructorComponent {
  instructorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private instructorService: InstructorService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.instructorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      qualifications: ['', [Validators.required, Validators.minLength(5)]],
      courses: ['', [Validators.required, Validators.minLength(3)]], 
      yearsOfExperience: [0, [Validators.required, Validators.min(0)]],
      confirmation: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.instructorForm.valid) {
      const formData = this.instructorForm.value;

 const application: InstructorApplication = {
  name: formData.name,
  email: formData.email,
  qualifications: formData.qualifications,
  experience: formData.yearsOfExperience,
  courses: formData.courses
};


      const username = this.authService.getUsername(); // Replace with actual implementation

      this.instructorService.applyAsInstructor(application, username).subscribe({
        next: () => {
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
        },
        error: (err) => {
          console.error('Application submission failed:', err);
          this.snackBar.open('❌ Submission failed. Please try again.', 'Close', {
            duration: 4000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
          });
        }
      });
    }
  }
}
