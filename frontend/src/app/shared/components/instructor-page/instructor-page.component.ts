import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';
import { InstructorDetails } from '../../models/instructor-details.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-instructor-page',
  templateUrl: './instructor-page.component.html',
  styleUrls: ['./instructor-page.component.css']
})
export class InstructorPageComponent implements OnInit, OnDestroy {
  instructorDetails: InstructorDetails | null = null;
  courses: Course[] = [];
  pagedCourses: Course[] = [];
  isLoading = false;
  error: string | null = null;
  averageRating: number | null = null;
  enrollmentCount: number | null = null;
  
  // Pagination
  currentPage = 0;
  pageSize = 6;
  pageSizeOptions = [6, 12, 18];
  
  // FontAwesome icons
  faStar = faStar;
  
  private destroy$ = new Subject<void>();
  private averageRatingCache = new Map<number, Observable<number>>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private instructorService: InstructorService,
    private courseService: CourseService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const instructorId = +params['id'];
      if (instructorId) {
        this.loadInstructorData(instructorId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInstructorData(instructorId: number): void {
    this.isLoading = true;
    this.error = null;

    // Load instructor details
    this.instructorService.getInstructorDetails(instructorId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (instructor) => {
        this.instructorDetails = instructor;
        this.loadAdditionalData(instructorId);
      },
      error: (error) => {
        this.error = 'Failed to load instructor details. Please try again.';
        this.isLoading = false;
        console.error('Error loading instructor:', error);
      }
    });
  }

  private loadAdditionalData(instructorId: number): void {
    // Load courses, ratings, and enrollment count in parallel
    const courses$ = this.courseService.getCoursesByInstructor(instructorId);
    const rating$ = this.instructorService.getInstructorAverageRating(instructorId);
    const enrollment$ = this.instructorService.getEnrollmentCount(instructorId);

    // Load courses
    courses$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (courses) => {
        this.courses = courses || [];
        this.updatePagedCourses();
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.courses = [];
        this.updatePagedCourses();
      }
    });

    // Load average rating
    rating$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (rating) => {
        this.averageRating = rating;
      },
      error: (error) => {
        console.error('Error loading instructor rating:', error);
        this.averageRating = null;
      }
    });

    // Load enrollment count
    enrollment$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (count) => {
        this.enrollmentCount = count;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading enrollment count:', error);
        this.enrollmentCount = null;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  retryLoad(): void {
    const instructorId = +this.route.snapshot.params['id'];
    if (instructorId) {
      this.loadInstructorData(instructorId);
    }
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/default-instructor.jpg';
  }

  // Pagination methods
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedCourses();
  }

  private updatePagedCourses(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedCourses = this.courses.slice(startIndex, endIndex);
  }

  trackByCourseId(index: number, course: Course): any {
    return course.id || index;
  }

  // Course rating methods
  getAverageRating$(courseId: number): Observable<number> {
    if (!this.averageRatingCache.has(courseId)) {
      const rating$ = this.courseService.getAverageRating(courseId).pipe(
        catchError(() => of(0))
      );
      this.averageRatingCache.set(courseId, rating$);
    }
    return this.averageRatingCache.get(courseId)!;
  }

  getStarIcon(rating: number, position: number): any {
    return this.faStar;
  }

  getStarColor(rating: number, position: number): string {
    if (rating >= position) {
      return '#ffd700'; // Gold for filled stars
    } else if (rating >= position - 0.5) {
      return '#ffd700'; // Gold for half stars (simplified)
    } else {
      return '#e0e0e0'; // Light gray for empty stars
    }
  }

  // Course action methods
  previewCourse(courseId: number): void {
    this.router.navigate(['/courses', courseId]);
  }

  enrollInCourse(courseId: number): void {
    // Navigate to course details for enrollment
    this.router.navigate(['/courses', courseId]);
  }

  viewCourseDetails(courseId: number): void {
    this.router.navigate(['/courses', courseId]);
  }

  navigateToInstructor(instructorId: number): void {
    this.router.navigate(['/instructor', instructorId]);
  }
}