import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state'; // Adjusted path
import { UserRole } from '../../enums/user-role.enum'; // Adjusted path

@Component({
  selector: 'app-course-details-dialog',
  templateUrl: './course-details-dialog.component.html',
  styleUrls: ['./course-details-dialog.component.css']
})
export class CourseDetailsDialogComponent {
  isAdmin$: Observable<boolean>;

  constructor(
    public dialogRef: MatDialogRef<CourseDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>
  ) {
    this.isAdmin$ = this.store.select(state => {
      const role = state.auth?.role;
      return role === UserRole.Admin;
    });
  }

  applyForCourse(): void {
    this.dialogRef.close('apply');
  }
}