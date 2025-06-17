// src/app/components/course-details-dialog/course-details-dialog.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { UserRole } from '../../enums/user-role.enum';
import { Course } from '../../models/course.model';
import { selectCourseById } from '../../state/course.selectors';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CourseApplyDialogComponent } from '../course-apply-dialog/course-apply-dialog.component';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details-dialog.component.html',
  styleUrls: ['./course-details-dialog.component.css']
})
export class CourseDetailsComponent implements OnInit {
  course: Course | null = null;
  isAdmin$: Observable<boolean>;
  allowApply: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.isAdmin$ = this.store.select(state => state.auth?.role === UserRole.ADMIN);
  }

  ngOnInit(): void {
    // Get course ID from route parameter (string)
    const id = this.route.snapshot.paramMap.get('id');
    const numericId = id ? parseInt(id, 10) : null;

    if (numericId == null || isNaN(numericId)) {
      console.error('Invalid course ID:', id);
      this.snackBar.open('Invalid course ID', 'Close', { duration: 5000 });
      this.router.navigate(['/courses']);
      return;
    }

    // Get course data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.course = navigation.extras.state['course'] as Course;
      this.allowApply = navigation.extras.state['allowApply'] || false;
    }

    // Fallback: Fetch course by ID from store if state is unavailable
    if (!this.course) {
      this.store.select(selectCourseById(numericId)).subscribe(course => {
        if (course) {
          this.course = course;
          this.allowApply = true;
        } else {
          console.error(`Course with ID ${numericId} not found`);
          this.snackBar.open('Course not found', 'Close', { duration: 5000 });
          this.router.navigate(['/courses']);
        }
      });
    }
  }

  applyForCourse(): void {
    if (this.course) {
      const dialogRef = this.dialog.open(CourseApplyDialogComponent, {
        width: '500px',
        data: { course: this.course }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result?.message) {
          this.snackBar.open(`✅ ${result.message}`, 'Close', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: ['custom-snackbar']
          });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }
}