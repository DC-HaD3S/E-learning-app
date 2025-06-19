import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Course } from 'src/app/models/course.model';
import { UserRole } from 'src/app/enums/user-role.enum';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseApplyDialogComponent } from '../course-apply-dialog/course-apply-dialog.component';
import { loadCourses } from 'src/app/state/course.actions';
import { Observable, of, combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { take, catchError, map, switchMap, tap, shareReplay } from 'rxjs/operators';
import { selectCourses, selectCourseError, selectCourseState, selectEnrollments, selectCourseById } from 'src/app/state/course.selectors';
import { AppState } from 'src/app/state/app.state';
import { CourseService } from 'src/app/services/course.service';

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
  username$: Observable<string | null>;
  private enrollmentCache = new Map<number, Observable<boolean>>();
  private canApplyCache = new Map<number, Observable<boolean>>();

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private courseService: CourseService
  ) {
    this.courses$ = this.store.select(selectCourses).pipe(
      catchError(() => {
        console.error('Selector error: returning empty array');
        return of([]);
      })
    );
    this.error$ = this.store.select(selectCourseError);
    this.isAdmin$ = this.store.select(state => state.auth?.role === UserRole.ADMIN).pipe(
      tap(isAdmin => console.log('isAdmin$:', isAdmin))
    );
    this.role$ = this.store.select(state => state.auth?.role);
    this.username$ = this.store.select(state => state.auth?.user?.username || null).pipe(
      tap(username => console.log('username$:', username))
    );
  }

  ngOnInit(): void {
    this.store.dispatch(loadCourses());
    this.store.select(state => state).subscribe(state => {
      if (!state.courses) {
        console.warn('Courses state not initialized, re-dispatching loadCourses');
        this.store.dispatch(loadCourses());
      }
    });
    this.store.select(selectCourseState).subscribe(state => {});
    this.courses$.subscribe({
      next: (courses) => {
        this.isLoading = false;
        if (Array.isArray(courses)) {
          this.rawCourses = [...courses];
          console.log('rawCourses:', this.rawCourses); // Debug: Log raw courses
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
    // Debug: Log enrollments and courses from store
    this.store.select(selectEnrollments).subscribe(enrollments => {
      console.log('Store enrollments:', enrollments);
    });
    this.store.select(selectCourses).subscribe(courses => {
      console.log('Store courses:', courses);
    });
  }

  getIsEnrolled$(courseId: number): Observable<boolean> {
    if (!this.enrollmentCache.has(courseId)) {
      this.enrollmentCache.set(courseId, combineLatest([
        this.store.select(selectEnrollments),
        this.username$
      ]).pipe(
        switchMap(([enrollments, username]) => {
          if (courseId == null || username == null) {
            console.log('getIsEnrolled$ returning false: courseId or username is null', { courseId, username });
            return of(false);
          }
          if (enrollments.length > 0) {
            const isEnrolled = enrollments.some(enrollment => {
              return enrollment.courseId === courseId && enrollment.username === username;
            });
            console.log('getIsEnrolled$ from store:', { courseId, isEnrolled }); // Debug
            return of(isEnrolled);
          }
          return this.courseService.getEnrolledCourses().pipe(
            map(apiEnrollments => {
              const isEnrolled = apiEnrollments.some(enrollment => {
                return enrollment.courseId === courseId && enrollment.username === username;
              });
              console.log('getIsEnrolled$ from API:', { courseId, isEnrolled }); // Debug
              return isEnrolled;
            }),
            catchError(err => {
              console.error('Failed to fetch enrollments from API:', err);
              this.snackBar.open('Failed to check enrollment status', 'Close', { duration: 5000 });
              return of(false);
            })
          );
        }),
        shareReplay(1) // Cache the result to avoid repeated API calls
      ));
    }
    return this.enrollmentCache.get(courseId)!;
  }

  getCanApply$(courseId: number): Observable<boolean> {
    if (!this.canApplyCache.has(courseId)) {
      this.canApplyCache.set(courseId, combineLatest([
        this.getIsEnrolled$(courseId),
        this.username$,
        this.store.select(selectCourseById(courseId)).pipe(
          tap(course => console.log('selectCourseById:', { courseId, course })), // Debug
          map(course => course ?? this.sortedCourses.find(c => c.id === courseId) ?? null) // Fallback to sortedCourses
        )
      ]).pipe(
        map(([isEnrolled, username, course]) => {
          const canApply = !isEnrolled && !!username && !!course;
          console.log('getCanApply$:', { courseId, isEnrolled, username, courseExists: !!course, canApply }); // Debug
          return canApply;
        }),
        shareReplay(1) // Cache the result
      ));
    }
    return this.canApplyCache.get(courseId)!;
  }

  sortCourses(): void {
    const validCourses = this.rawCourses.filter(course =>
      course.id != null &&
      course.title &&
      course.price != null &&
      course.body &&
      course.imageUrl
    ) as Course[];
    this.sortedCourses = [...validCourses];
    console.log('sortedCourses:', this.sortedCourses); // Debug: Log sorted courses
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
    if (!course.id) {
      console.error('Course ID is missing:', course);
      this.snackBar.open('Error: Course ID is missing', 'Close', { duration: 5000 });
      return;
    }
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

  navigateToFeedback(courseId: number): void {
    if (courseId == null) {
      console.error('Course ID is missing');
      this.snackBar.open('Error: Course ID is missing', 'Close', { duration: 5000 });
      return;
    }
    this.router.navigate(['/feedback', courseId.toString()]).catch(err => {
      console.error('Navigation to /feedback failed:', err);
      this.snackBar.open('Failed to navigate to feedback page', 'Close', { duration: 5000 });
    });
  }

  trackByCourseId(index: number, course: Course): number {
    return course.id ?? index;
  }
}