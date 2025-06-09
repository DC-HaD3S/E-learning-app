import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  feedbackForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.feedbackForm = this.fb.group({
      courseId: ['', [Validators.required, Validators.min(1)]],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comments: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      console.log('Feedback submitted:', this.feedbackForm.value);
      this.snackBar.open('✅ Feedback submitted successfully!', 'Close', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: ['custom-snackbar']
      });
      this.feedbackForm.reset();
      setTimeout(() => {
        this.router.navigate(['/user/home']);
      }, 2000);
    }
  }
}