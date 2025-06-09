import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Course } from 'src/app/models/course.model';
import { UserRole } from 'src/app/enums/user-role.enum';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseApplyDialogComponent } from '../course-apply-dialog/course-apply-dialog.component';
import { loadCourses } from 'src/app/state/course.actions';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { CourseDetailsDialogComponent } from '../course-details-dialog/course-details-dialog.component';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses$: Observable<Course[]>;
  error$: Observable<string | null>;
  isAdmin$: Observable<boolean>;
  role$: Observable<UserRole | null>;

  constructor(
    private store: Store<{ courses: { courses: Course[], error: string | null }, auth: { role: UserRole | null } }>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.courses$ = this.store.select(state => state.courses.courses);
    this.error$ = this.store.select(state => state.courses.error);
    this.isAdmin$ = this.store.select(state => state.auth.role === UserRole.Admin);
    this.role$ = this.store.select(state => state.auth.role);
  }
ngOnInit(): void {
  this.store.dispatch(loadCourses());
  this.courses$.subscribe(courses => console.log('Courses:', courses));
  this.error$.subscribe(error => console.log('Error:', error));
  this.isAdmin$.subscribe(isAdmin => console.log('Is Admin:', isAdmin));
}
  openApplyDialog(course: Course): void {
    this.role$.pipe(take(1)).subscribe(role => {
      if (!role) {
        this.snackBar.open('Please log in first', 'Close', { duration: 3000 });
        this.router.navigate(['/login']);
      } else {
        const dialogRef = this.dialog.open(CourseApplyDialogComponent, {
          width: '500px',
          data: { course }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result && result.message) {
            this.snackBar.open(`✅ ${result.message}`, 'Close', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
              panelClass: ['custom-snackbar']
            });
          }
        });
      }
    });
  }


openDetailsDialog(course: any): void {
  const dialogRef = this.dialog.open(CourseDetailsDialogComponent, {
    width: '600px',
    maxWidth: '90vw',
    data: course
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 'apply') {
      this.openApplyDialog(course);
    }
  });
}

  viewEnrolledUsers(courseId: number): void {
    this.snackBar.open(`Viewing enrolled users for course ID: ${courseId}`, 'Close', {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['custom-snackbar']
    });
  }
}