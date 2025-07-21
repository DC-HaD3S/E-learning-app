import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InstructorService } from 'src/app/shared/services/instructor.service';
import { Instructor } from 'src/app/shared/models/instructor-application.model';
import { Course } from 'src/app/shared/models/course.model';
import { AuthService } from 'src/app/auth/auth.services';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-instructor-profile',
  templateUrl: './instructor-profile.component.html',
  styleUrls: ['./instructor-profile.component.css']
})
export class InstructorProfileComponent implements OnInit {
  instructor: any = null;
  instructorId: number = 0;
  averageRating: number = 0;
  enrollmentCount: number = 0;
  highestEnrolledCourses: any[] = [];
  isLoading = false;
  
  // Font Awesome icons
  fullStar = faStar;
  emptyStar = faStarEmpty;

  constructor(
    private router: Router,
    private instructorService: InstructorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadInstructorProfile();
  }

  loadInstructorProfile(): void {
    if (!this.authService.isLoggedIn() || !this.authService.isInstructor()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.isLoading = true;
    
    // First get the instructor ID
    this.authService.getInstructorId().pipe(
      switchMap(instructorId => {
        if (!instructorId) {
          throw new Error('Instructor ID not found');
        }
        this.instructorId = instructorId;
        
        // Load all instructor data in parallel
        return forkJoin({
          details: this.instructorService.getInstructorById(instructorId),
          rating: this.instructorService.getInstructorAverageRating(instructorId),
          enrollmentCount: this.instructorService.getInstructorEnrollmentCount(instructorId),
          highestCourses: this.instructorService.getInstructorHighestEnrolledCourses(instructorId)
        });
      })
    ).subscribe({
      next: (data) => {
        this.instructor = data.details;
        this.averageRating = data.rating?.averageRating || 0;
        this.enrollmentCount = data.enrollmentCount || 0;
        this.highestEnrolledCourses = data.highestCourses || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading instructor profile:', error);
        this.isLoading = false;
        // If instructor not found, might be a user who hasn't applied yet
        if (error.message.includes('Instructor application not found') || error.message.includes('Instructor ID not found')) {
          this.router.navigate(['/user/instructor-application']);
        }
      }
    });
  }

  editProfile(): void {
    this.router.navigate(['/instructor/edit']);
  }

  manageCourses(): void {
    this.router.navigate(['/instructor/courses']);
  }

  getStarIcon(rating: number, position: number): any {
    return rating >= position ? this.fullStar : this.emptyStar;
  }

  getStarColor(rating: number, position: number): string {
    return rating >= position ? '#ffd700' : '#d1d5db';
  }

  viewCourseDetails(course: Course): void {
    this.router.navigate(['/course-details', course.id]);
  }
}