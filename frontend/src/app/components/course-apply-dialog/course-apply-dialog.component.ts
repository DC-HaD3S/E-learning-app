import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { AuthService } from 'src/app/services/auth.services';
import { Course } from '../../models/course.model';
import { enrollUser, clearCourseError } from '../../state/course.actions';
import { selectCourseMessage, selectCourseError } from '../../state/course.selectors';

@Component({
  selector: 'app-course-apply-dialog',
  templateUrl: './course-apply-dialog.component.html',
  styleUrls: ['./course-apply-dialog.component.css']
})
export class CourseApplyDialogComponent implements OnInit {
  applyForm: FormGroup;
  username: string;

  constructor(
    public dialogRef: MatDialogRef<CourseApplyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { course: Course },
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private store: Store<AppState>,
    private snackBar: MatSnackBar
  ) {
    this.username = authService.getUsername();
    this.applyForm = this.formBuilder.group({
      confirmation: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    if (!this.username) {
      this.snackBar.open('Please log in to enroll.', 'Close', { duration: 5000 });
      this.dialogRef.close(false);
    }
    this.store.select(selectCourseMessage).subscribe(message => {
      if (message) {
        this.snackBar.open(message, 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      }
    });
    this.store.select(selectCourseError).subscribe(error => {
      if (error) {
        this.snackBar.open(`Enrollment failed: ${error}`, 'Close', { duration: 5000 });
        this.store.dispatch(clearCourseError());
        this.dialogRef.close(false);
      }
    });
  }

  onSubmit(): void {
    if (this.applyForm.valid && this.data.course.id && this.username) {
      this.store.dispatch(enrollUser({ courseId: this.data.course.id, courseName: this.data.course.title }));
    } else {
      this.snackBar.open('Invalid form or course data', 'Close', { duration: 3000 });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}