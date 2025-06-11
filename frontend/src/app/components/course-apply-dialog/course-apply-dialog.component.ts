import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.services';

@Component({
  selector: 'app-course-apply-dialog',
  templateUrl: './course-apply-dialog.component.html',
  styleUrls: ['./course-apply-dialog.component.css']
})
export class CourseApplyDialogComponent {
  applyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private courseService: CourseService,
    private authService: AuthService, // Inject AuthService
    public dialogRef: MatDialogRef<CourseApplyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { course: Course }
  ) {
    this.applyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      confirmation: [false, Validators.requiredTrue]
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 3000 });
  }

  onSubmit(): void {
    if (this.applyForm.valid) {
      const username = this.authService.getUsername(); // Get username from AuthService
      this.courseService.enrollUser(username, this.data.course.id!, this.data.course.title).subscribe({
        next: (message) => {
          this.openSnackBar(
            `Successfully enrolled in "${this.data.course.title}"${this.data.course.price === 0 ? ' for free!' : ` for $${this.data.course.price}!`}`,
            'Close'
          );
          this.applyForm.reset();
          this.dialogRef.close({ success: true });
        },
        error: (err) => {
          this.openSnackBar(`Enrollment failed for "${this.data.course.title}": ${err.message}`, 'Close');
          this.dialogRef.close({ success: false, message: 'Enrollment failed.' });
        }
      });
    }
  }

  onCancel(): void {
    this.openSnackBar(`Canceled enrollment of "${this.data.course.title}"`, 'Close');
    this.dialogRef.close({ success: false, message: null });
  }
}