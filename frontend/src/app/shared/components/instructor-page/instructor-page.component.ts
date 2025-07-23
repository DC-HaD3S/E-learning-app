import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';
import { InstructorDetails } from '../../models/instructor-details.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private router: Router,
    private instructorService: InstructorService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const rawInstructorId = params.get('instructorId');
      const instructorId = Number(rawInstructorId);
      if (rawInstructorId && !isNaN(instructorId) && instructorId > 0) {
        this.loadInstructorData(instructorId);
      } else {
        this.error = `Invalid instructor ID: '${rawInstructorId || 'not provided'}'. Expected a positive number.`;
        console.error(this.error);
        this.snackBar.open('Invalid instructor ID', 'Close', { duration: 5000 });
        this.router.navigate(['/courses']);
        this.cdr.detectChanges();
      }
    });
  }

  private loadInstructorData(instructorId: number): void {
    this.instructorService.getInstructorDetails(instructorId).subscribe({
      next: (details) => {

        this.instructorDetails = details;
        // Preload image to detect issues early
        const img = new Image();
        img.src = details.photoUrl || 'assets/default-instructor.jpg';

        img.onerror = (err) => {
          console.error('Image failed to load:', img.src);
          console.error('Error details:', err);
        };
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 400 && err.error?.message?.includes('User is not an instructor')) {
          this.snackBar.open('Instructor not found', 'Close', { duration: 5000 });
          this.router.navigate(['/courses']);
        } else {
          this.error = `Failed to load instructor details: ${err.message}`;
          console.error(this.error);
        }
        this.cdr.detectChanges();
      }
    });

    this.instructorService.getInstructorAverageRating(instructorId).subscribe({
      next: (rating) => {
        this.averageRating = rating;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 400) {
          this.averageRating = null;
        } else {
          this.error = `Failed to load average rating: ${err.message}`;
          console.error(this.error);
        }
        this.cdr.detectChanges();
      }
    });

    this.instructorService.getEnrollmentCount(instructorId).subscribe({
      next: (count) => {
        this.enrollmentCount = count;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 400) {
          this.enrollmentCount = 0;
        } else {
          this.error = `Failed to load enrollment count: ${err.message}`;
          console.error(this.error);
        }
        this.cdr.detectChanges();
      }
    });
  }

  handleImageError(event: any): void {
    console.error('Image load failed in UI:', event.target.src);
    console.error('Error event details:', event);
    event.target.src = 'assets/default-instructor.jpg';
  }
}