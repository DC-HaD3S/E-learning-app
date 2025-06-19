
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { UserRole } from '../../enums/user-role.enum';
import { Course } from '../../models/course.model';
import { Feedback } from '../../models/feedback.model';
import { FeedbackService } from '../../services/feedback.service';
import { selectCourseById, selectEnrollments } from '../../state/course.selectors';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CourseApplyDialogComponent } from '../course-apply-dialog/course-apply-dialog.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details-dialog.component.html',
  styleUrls: ['./course-details-dialog.component.css']
})
export class CourseDetailsComponent implements OnInit, AfterViewInit {
  course: Course | null = null;
  feedbacks: Feedback[] = [];
  dataSource: MatTableDataSource<Feedback> = new MatTableDataSource<Feedback>([]);
  displayedColumns: string[] = ['username', 'rating', 'comments'];
  sortField: string = 'rating';
  sortOrder: 'asc' | 'desc' = 'desc';
  isAdmin$: Observable<boolean>;
  isEnrolled$: Observable<boolean>;
  username$: Observable<string | null>;
  allowApply: boolean = false;
  averageRating: number | null = null;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private feedbackService: FeedbackService
  ) {
    this.isAdmin$ = this.store.select(state => state.auth?.role === UserRole.ADMIN);
    this.username$ = this.store.select(state => state.auth?.user?.username || null);
    this.isEnrolled$ = combineLatest([
      this.store.select(selectEnrollments),
      this.username$
    ]).pipe(
      map(([enrollments, username]) => {
        const courseId = this.route.snapshot.paramMap.get('id');
        const numericId = courseId ? parseInt(courseId, 10) : null;
        return numericId != null && username != null && enrollments.some(enrollment =>
          enrollment.courseId === numericId && enrollment.username === username
        );
      })
    );
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const numericId = id ? parseInt(id, 10) : null;

    if (numericId == null || isNaN(numericId)) {
      console.error('Invalid course ID:', id);
      this.snackBar.open('Invalid course ID', 'Close', { duration: 5000 });
      this.router.navigate(['/courses']);
      return;
    }

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.course = navigation.extras.state['course'] as Course;
      this.allowApply = navigation.extras.state['allowApply'] || false;
    }

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

    this.loadFeedbacks(numericId);
    this.loadAverageRating(numericId);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.sort.active = this.sortField;
    this.sort.direction = this.sortOrder;
    this.sort.sortChange.emit({ active: this.sortField, direction: this.sortOrder });
  }

  loadFeedbacks(courseId: number): void {
    this.feedbackService.getFeedbacksByCourseId(courseId).subscribe({
      next: (feedbacks: Feedback[]) => {
        console.log('Feedbacks loaded:', feedbacks);
        this.feedbacks = feedbacks.map(f => ({
          ...f,
          rating: Number(f.rating) // Ensure rating is a number
        }));
        this.dataSource.data = [...this.feedbacks];
      },
      error: (err: any) => {
        console.error('Failed to load feedbacks:', err);
        this.snackBar.open('Failed to load feedbacks', 'Close', { duration: 5000 });
      }
    });
  }

loadAverageRating(courseId: number): void {
  this.feedbackService.getFeedbacksByCourseId(courseId).subscribe({
    next: (feedbacks: Feedback[]) => {
      if (feedbacks.length > 0) {
        const sum = feedbacks.reduce((acc, feedback) => acc + Number(feedback.rating), 0);
        const avg = sum / feedbacks.length;
        this.averageRating = Math.round(avg * 2) / 2;
      } else {
        this.averageRating = 0;
      }
    },
    error: (err: any) => {
      console.error('Failed to load feedbacks for average rating:', err);
      this.snackBar.open('Failed to load average rating', 'Close', { duration: 5000 });
      this.averageRating = 0;
    }
  });
}

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortFeedbacks();
  }

  sortFeedbacks(): void {
    this.sort.active = this.sortField;
    this.sort.direction = this.sortOrder;
    this.sort.sortChange.emit({ active: this.sortField, direction: this.sortOrder });
    this.dataSource.sort = this.sort;
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