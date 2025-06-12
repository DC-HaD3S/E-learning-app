import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { Observable } from 'rxjs';
import { Enrollment } from '../../models/enrollment.model';
import { selectEnrollments, selectCourseError } from '../../state/course.selectors';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '../../services/course.service';

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

  selectedCourse: any = null; // ✅ declare this
  @ViewChild('courseDialogTemplate') courseDialogTemplate!: TemplateRef<any>; // ✅ declare this

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
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
              this.sortedEnrollments = enrollments.map(enroll => {
                const course = allCourses.find(c => c.id === enroll.courseId);
                return {
                  ...enroll,
                  body: course?.body,
                  imageUrl: course?.imageUrl,
                  price: course?.price
                };
              });
              console.log("Enriched Enrollments:", this.sortedEnrollments);
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

  openDetailsDialog(course: any): void {
    this.selectedCourse = course;
    this.dialog.open(this.courseDialogTemplate, {
      width: '400px'
    });
  }
}
