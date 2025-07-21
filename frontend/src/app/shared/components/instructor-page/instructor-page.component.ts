import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';
import { Instructor } from '../../models/instructor-application.model';
import { Course } from '../../models/course.model';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-instructor-page',
  templateUrl: './instructor-page.component.html',
  styleUrls: ['./instructor-page.component.css']
})
export class InstructorPageComponent implements OnInit {
  instructor: Instructor | null = null;
  instructorName: string | null = null;
  isLoading = false;
  
  // Font Awesome icons
  fullStar = faStar;
  emptyStar = faStarEmpty;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private instructorService: InstructorService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.instructorName = decodeURIComponent(params.get('name') || '');
      if (this.instructorName) {
        this.loadInstructorProfile();
      }
    });
  }

  loadInstructorProfile(): void {
    if (!this.instructorName) return;
    
    this.isLoading = true;
    this.instructorService.getInstructorByName(this.instructorName).subscribe({
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