import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.services';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  enrolledCourses: { courseId: number, courseName: string }[] = [];
constructor(
  private fb: FormBuilder,
  private snackBar: MatSnackBar,
  private router: Router,
  private http: HttpClient,
  private authService: AuthService
) {
this.feedbackForm = this.fb.group({
  courseId: ['', Validators.required], // ✅ this stays
  rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
  comments: ['', [Validators.required, Validators.minLength(10)]]
});



  }

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8084/user/enrolled-courses').subscribe({
      next: (data) => {
        this.enrolledCourses = data.map(e => ({ courseId: e.courseId, courseName: e.courseName }));
      },
      error: () => {
        this.snackBar.open('Failed to load enrolled courses.', 'Close', { duration: 5000 });
      }
    });
  }onSubmit(): void {
  if (this.feedbackForm.valid) {
    const username = this.authService.getUsername(); // from JWT

    // ✅ Find the selected course based on courseId
    const selectedCourse = this.enrolledCourses.find(
      course => course.courseId === this.feedbackForm.value.courseId
    );

    const payload = {
      username,
      courseId: this.feedbackForm.value.courseId,
      courseName: selectedCourse?.courseName || '', // ✅ Include courseName if required
      rating: this.feedbackForm.value.rating,
      comments: this.feedbackForm.value.comments
    };

    this.http.post('http://localhost:8084/feedback/submit', payload).subscribe({
      next: () => {
        this.snackBar.open('✅ Feedback submitted successfully!', 'Close', {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['custom-snackbar']
        });
        this.feedbackForm.reset();
        setTimeout(() => this.router.navigate(['/user/home']), 2000);
      },
      error: (err) => {
        this.snackBar.open('❌ Failed to submit feedback: ' + (err.error || 'Unknown error'), 'Close', { duration: 5000 });
        console.error('Feedback submission error:', err);
      }
    });
  }
}
}