import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InstructorService } from 'src/app/shared/services/instructor.service';
import { Instructor } from 'src/app/shared/models/instructor-application.model';
import { Course } from 'src/app/shared/models/course.model';
import { AuthService } from 'src/app/auth/auth.services';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-instructor-profile',
  templateUrl: './instructor-profile.component.html',
  styleUrls: ['./instructor-profile.component.css']
})
export class InstructorProfileComponent implements OnInit {
  instructor: Instructor | null = null;
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
    const username = this.authService.getUsername();
    if (!username) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.isLoading = true;
    this.instructorService.getInstructorByName(username).subscribe({
      next: (instructor) => {
        this.instructor = instructor;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading instructor profile:', error);
        this.isLoading = false;
      }
    });
  }

  editProfile(): void {
    this.router.navigate(['/instructor/edit']);
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