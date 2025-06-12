import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
    selector: 'app-course-apply-dialog',
    templateUrl: './course-apply-dialog.component.html',
    styleUrls: ['./course-apply-dialog.component.css']
})
export class CourseApplyDialogComponent implements OnInit {
    applyForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<CourseApplyDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { course: Course },
        private formBuilder: FormBuilder,
        private courseService: CourseService,
        private snackBar: MatSnackBar
    ) {
        this.applyForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            confirmation: [false, Validators.requiredTrue]
        });
    }

    ngOnInit(): void {}

    onSubmit(): void {
        if (this.applyForm.valid && this.data.course.id) {
            const { username } = this.applyForm.value;
            this.courseService.enrollUser(username, this.data.course.id, this.data.course.title).subscribe({
                next: (response) => {
                    this.snackBar.open(response.message, 'Close', { duration: 3000 });
                    this.dialogRef.close(true);
                },
                error: (error) => {
                    console.error('Enrollment failed:', error);
                    this.snackBar.open('Enrollment failed: ' + (error.error?.message || 'Unknown error'), 'Close', { duration: 5000 });
                    this.dialogRef.close(false);
                }
            });
        } else {
            this.snackBar.open('Invalid form or course data', 'Close', { duration: 3000 });
        }
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}