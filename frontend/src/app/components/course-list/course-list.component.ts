import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Course } from 'src/app/models/course.model';
import { UserRole } from 'src/app/enums/user-role.enum';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseApplyDialogComponent } from '../course-apply-dialog/course-apply-dialog.component';
import { loadCourses } from 'src/app/state/course.actions';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { take, catchError } from 'rxjs/operators';
import { selectCourses, selectCourseError, selectCourseState } from 'src/app/state/course.selectors';
import { AppState } from 'src/app/state/app.state';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses$: Observable<Course[] | undefined>;
  error$: Observable<string | null>;
  isAdmin$: Observable<boolean>;
  role$: Observable<UserRole | null>;
  sortedCourses: Course[] = [];
  sortCriteria: string = 'title-asc';
  private rawCourses: Course[] = [];
  hasCourses: boolean = false;
  isLoading: boolean = true;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.courses$ = this.store.select(selectCourses).pipe(
      catchError(() => {
        console.error('Selector error: returning empty array');
        return of([]);
      })
    );
    this.error$ = this.store.select(selectCourseError);
    this.isAdmin$ = this.store.select(state => state.auth?.role === UserRole.ADMIN);
    this.role$ = this.store.select(state => state.auth?.role);
  }

  ngOnInit(): void {
    this.store.dispatch(loadCourses());
    this.store.select(state => state).subscribe(state => {
      if (!state.courses) {
        console.warn('Courses state not initialized, re-dispatching loadCourses');
        this.store.dispatch(loadCourses());
      }
    });
    this.store.select(selectCourseState).subscribe(state => {
    });
    this.courses$.subscribe({
      next: (courses) => {
        this.isLoading = false;
        if (Array.isArray(courses)) {
          this.rawCourses = [...courses];
          this.hasCourses = courses.length > 0;
          this.rawCourses.forEach(course => {
            if (!course.id) console.warn('Missing id:', course);
            if (!course.title) console.warn('Missing title:', course);
            if (course.price == null) console.warn('Missing price:', course);
            if (!course.body) console.warn('Missing body:', course);
            if (!course.imageUrl) console.warn('Missing imageUrl:', course);
          });
          this.sortCourses();

        } else {
          console.error('Invalid courses:', courses);
          this.rawCourses = [];
          this.sortedCourses = [];
          this.hasCourses = false;
        }
      },
      error: (err) => {
        console.error('Courses$ error:', err);
        this.isLoading = false;
      }
    });
    this.error$.subscribe(error => {
      if (error) {
        console.error('Store error:', error);
        this.snackBar.open(`Error: ${error}`, 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  sortCourses(): void {
    const validCourses = this.rawCourses.filter(course =>
      course.id &&
      course.title &&
      course.price != null &&
      course.body &&
      course.imageUrl
    );
    this.sortedCourses = [...validCourses];
    const [field, direction] = this.sortCriteria.split('-');

    this.sortedCourses.sort((a, b) => {
      if (field === 'title') {
        const valueA = a.title?.toLowerCase() || '';
        const valueB = b.title?.toLowerCase() || '';
        return direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (field === 'price') {
        const valueA = a.price ?? 0;
        const valueB = b.price ?? 0;
        return direction === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      }
      return 0;
    });
  }

  openApplyDialog(course: Course): void {
    this.role$.pipe(take(1)).subscribe(role => {
      if (!role) {
        this.snackBar.open('Please log in', 'Close', { duration: 3000 });
        this.router.navigate(['']);
      } else {
        const dialogRef = this.dialog.open(CourseApplyDialogComponent, {
          width: '500px',
          data: { course }
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
    });
  }

  openDetailsDialog(course: Course): void {
    if (!course.id) {
      console.error('Course ID is missing:', course);
      this.snackBar.open('Error: Course ID is missing', 'Close', { duration: 5000 });
      return;
    }
    this.router.navigate(['/course-details', course.id.toString()], {
      state: { course: course, allowApply: true }
    });
  }
}