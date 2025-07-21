import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';
import { InstructorDetails } from '../../models/instructor-details.model';

@Component({
  selector: 'app-instructor-page',
  templateUrl: './instructor-page.component.html',
  styleUrls: ['./instructor-page.component.css']
})
export class InstructorPageComponent implements OnInit {
  instructorDetails: InstructorDetails | null = null;
  averageRating: number | null = null;
  enrollmentCount: number | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private instructorService: InstructorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const rawInstructorId = params.get('instructorId');
      console.log('Raw instructorId from route:', rawInstructorId);
      const instructorId = Number(rawInstructorId);
      console.log('Parsed instructorId:', instructorId);
      if (rawInstructorId && !isNaN(instructorId) && instructorId > 0) {
        this.loadInstructorData(instructorId);
      } else {
        this.error = `Invalid instructor ID: '${rawInstructorId || 'not provided'}'. Expected a positive number.`;
        console.error(this.error);
        this.cdr.detectChanges();
      }
    });
  }

  private loadInstructorData(instructorId: number): void {
    console.log('Loading data for instructorId:', instructorId);
    // Fetch instructor details
    this.instructorService.getInstructorDetails(instructorId).subscribe({
      next: (details) => {
        console.log('Instructor details received:', details);
        this.instructorDetails = details;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = `Failed to load instructor details: ${err.message}`;
        console.error(this.error);
        this.cdr.detectChanges();
      }
    });

    // Fetch average rating
    this.instructorService.getInstructorAverageRating(instructorId).subscribe({
      next: (rating) => {
        console.log('Average rating received:', rating);
        this.averageRating = rating;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = `Failed to load average rating: ${err.message}`;
        console.error(this.error);
        this.cdr.detectChanges();
      }
    });

    // Fetch enrollment count
    this.instructorService.getEnrollmentCount(instructorId).subscribe({
      next: (count) => {
        console.log('Enrollment count received:', count);
        this.enrollmentCount = count;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = `Failed to load enrollment count: ${err.message}`;
        console.error(this.error);
        this.cdr.detectChanges();
      }
    });
  }
}