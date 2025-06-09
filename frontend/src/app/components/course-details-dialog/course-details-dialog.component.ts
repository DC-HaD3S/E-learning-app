import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-course-details-dialog',
  templateUrl: './course-details-dialog.component.html',
  styleUrls: ['./course-details-dialog.component.css']
})
export class CourseDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CourseDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  applyForCourse(): void {
    this.dialogRef.close('apply');
  }
}