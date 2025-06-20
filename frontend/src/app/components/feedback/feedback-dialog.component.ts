import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.services';
import { CourseService } from '../../services/course.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

export interface FeedbackDialogData {
  courseId: number;
  courseName: string;
  enrolledCourses: { courseId: number; courseName: string }[];
}

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.css']
})
export class FeedbackDialogComponent implements OnInit, OnDestroy {
  feedbackForm: FormGroup;
  enrolledCourses: { courseId: number; courseName: string }[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private courseService: CourseService,
    public dialogRef: MatDialogRef<FeedbackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FeedbackDialogData
  ) {
    this.feedbackForm = this.fb.group({
      courseId: [data.courseId || '', Validators.required],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comments: ['', [Validators.required, Validators.minLength(10)]]
    });
    this.enrolledCourses = data.enrolledCourses || [];
  }

  ngOnInit(): void {
    // If no enrolled courses provided, fetch them
    if (!this.enrolledCourses.length) {
      this.courseService.getEnrolledCourses().pipe(
        takeUntil(this.destroy$),
        tap(() => console.log('FeedbackDialogComponent: Fetching enrolled courses')) // Debug log
      ).subscribe({
        next: (enrollments) => {
          this.enrolledCourses = enrollments.map(e => ({
            courseId: e.courseId,
            courseName: e.courseName
          }));
          // Preselect course if courseId is provided
          if (this.data.courseId) {
            this.feedbackForm.patchValue({ courseId: this.data.courseId });
          }
        },
        error: (err) => {
          console.error('FeedbackDialogComponent: Failed to load enrolled courses:', err);
          this.snackBar.open('Failed to load enrolled courses.', 'Close', { duration: 5000 });
        }
      });
    } else if (this.data.courseId) {
      this.feedbackForm.patchValue({ courseId: this.data.courseId });
    }
  }

  ngOnDestroy(): void {
    console.log('FeedbackDialogComponent destroyed'); // Debug log
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      const username = this.authService.getUsername();
      if (!username) {
        this.snackBar.open('Please log in to submit feedback', 'Close', { duration: 3000 });
        this.dialogRef.close();
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/courses' } });
        return;
      }

      const selectedCourse = this.enrolledCourses.find(
        course => course.courseId === this.feedbackForm.value.courseId
      );

      const payload = {
        username,
        courseId: this.feedbackForm.value.courseId,
        courseName: selectedCourse?.courseName || this.data.courseName || '',
        rating: this.feedbackForm.value.rating,
        comments: this.feedbackForm.value.comments
      };

      this.http.post('http://localhost:8084/feedback/submit', payload).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.snackBar.open('✅ Feedback submitted successfully!', 'Close', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: ['custom-snackbar']
          });
          this.dialogRef.close({ message: 'Feedback submitted successfully' });
        },
        error: (err) => {
          console.error('FeedbackDialogComponent: Feedback submission error:', err);
          this.snackBar.open('❌ Failed to submit feedback: ' + (err.error || 'Unknown error'), 'Close', { duration: 5000 });
          this.dialogRef.close();
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}