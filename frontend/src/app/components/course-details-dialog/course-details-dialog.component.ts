import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { UserRole } from '../../enums/user-role.enum';
import { Course } from '../../models/course.model'; // Import Course model

@Component({
  selector: 'app-course-details-dialog',
  templateUrl: './course-details-dialog.component.html',
  styleUrls: ['./course-details-dialog.component.css']
})
export class CourseDetailsDialogComponent {
  isAdmin$: Observable<boolean>;
  course: Course; // Strongly typed course

  constructor(
    public dialogRef: MatDialogRef<CourseDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Course, // Type as Course
    private store: Store<AppState>
  ) {
    this.course = data; // Assign to course property
    this.isAdmin$ = this.store.select(state => state.auth?.role === UserRole.Admin);
  }

  applyForCourse(): void {
    this.dialogRef.close('apply');
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}