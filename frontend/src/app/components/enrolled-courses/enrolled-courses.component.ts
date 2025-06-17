import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { Observable } from 'rxjs';
import { Enrollment } from '../../models/enrollment.model';
import { Course } from '../../models/course.model';
import { selectEnrollments, selectCourseError } from '../../state/course.selectors';
import { AuthService } from 'src/app/services/auth.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '../../services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enrolled-courses',
  templateUrl: './enrolled-courses.component.html',
  styleUrls: ['./enrolled-courses.component.css']
})
export class EnrolledCoursesComponent implements OnInit {
  enrollments$: Observable<Enrollment[]>;
  error$: Observable<string | null>;
  sortedEnrollments: Enrollment[] = [];
  isLoading: boolean = false;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private authService: AuthService,
    private courseService: CourseService,
    private snackBar: MatSnackBar
  ) {
    this.enrollments$ = this.store.select(selectEnrollments);
    this.error$ = this.store.select(selectCourseError);
  }

  ngOnInit(): void {
    const username = this.authService.getUsername();
    if (username) {
      this.isLoading = true;
      this.courseService.getCourses().subscribe({
        next: (allCourses) => {
          this.courseService.getEnrolledCourses().subscribe({
            next: (enrollments) => {
              this.sortedEnrollments = enrollments.map(enroll => ({
                ...enroll,
                body: allCourses.find(c => c.id === enroll.courseId)?.body || '',
                imageUrl: allCourses.find(c => c.id === enroll.courseId)?.imageUrl || '',
                price: allCourses.find(c => c.id === enroll.courseId)?.price ?? 0
              }));
              this.isLoading = false;
            },
            error: () => {
              this.snackBar.open('Failed to load enrolled courses.', 'Close', { duration: 5000 });
              this.isLoading = false;
            }
          });
        },
        error: () => {
          this.snackBar.open('Failed to load course details.', 'Close', { duration: 5000 });
          this.isLoading = false;
        }
      });
    } else {
      this.snackBar.open('Please log in to view enrollments.', 'Close', { duration: 5000 });
    }
  }

  get hasCourses(): boolean {
    return this.sortedEnrollments.length > 0;
  }

  truncateBody(body: string | undefined, maxLength: number): string {
    if (!body) return '';
    return body.length > maxLength ? body.substring(0, maxLength) + '...' : body;
  }

  openDetailsDialog(enrollment: Enrollment): void {
    if (!enrollment.courseId) {
      console.error('Course ID is missing:', enrollment);
      this.snackBar.open('Error: Course ID is missing', 'Close', { duration: 5000 });
      return;
    }

    const course: Course = {
      id: enrollment.courseId,
      title: enrollment.courseName,
      body: enrollment.body || '',
      price: enrollment.price ?? 0,
      imageUrl: enrollment.imageUrl || ''
    };

    this.router.navigate(['/course-details', enrollment.courseId.toString()], {
      state: { course, allowApply: false }
    }).then(success => {
      console.log('Navigation success:', success);
    }).catch(err => {
      console.error('Navigation error:', err);
    });
  }
}