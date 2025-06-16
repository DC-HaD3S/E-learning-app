import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { UserRole } from '../../enums/user-role.enum';
import { Course } from '../../models/course.model'; 

export interface CourseDialogData extends Course {
  allowApply: boolean;
}

@Component({
  selector: 'app-course-details-dialog',
  templateUrl: './course-details-dialog.component.html',
  styleUrls: ['./course-details-dialog.component.css']
})export class CourseDetailsDialogComponent {
  isAdmin$: Observable<boolean>;
  course: Course;

  constructor(
    public dialogRef: MatDialogRef<CourseDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CourseDialogData,  
    private store: Store<AppState>
  ) {
    this.course = data;  
    this.isAdmin$ = this.store.select(state => state.auth?.role === UserRole.ADMIN);
  }

  applyForCourse(): void {
    this.dialogRef.close('apply');
  }

  closeDialog(): void {
    this.dialogRef.close();
  }}