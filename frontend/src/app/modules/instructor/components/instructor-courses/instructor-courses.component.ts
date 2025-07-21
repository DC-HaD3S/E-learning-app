import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/shared/services/course.service';
import { CourseContentService } from 'src/app/shared/services/course-content.service';
import { AuthService } from 'src/app/auth/auth.services';
import { Router } from '@angular/router';
import { Course } from 'src/app/shared/models/course.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-instructor-courses',
  templateUrl: './instructor-courses.component.html',
  styleUrls: ['./instructor-courses.component.css']
})
export class InstructorCoursesComponent implements OnInit {
  courses: Course[] = [];
  instructorId: number = 0;
  isLoading = false;
  selectedCourse: Course | null = null;
  showCourseForm = false;
  
  // Course form data
  courseForm = {
    id: null as number | null,
    title: '',
    price: 0,
    body: '',
    imageUrl: '',
    instructorId: 0
  };

  constructor(
    private courseService: CourseService,
    private courseContentService: CourseContentService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadInstructorCourses();
  }

  loadInstructorCourses(): void {
    if (!this.authService.isLoggedIn() || !this.authService.isInstructor()) {
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    
    // Get instructor ID and load courses
    this.authService.getInstructorId().subscribe({
      next: (instructorId) => {
        if (!instructorId) {
          throw new Error('Instructor ID not found');
        }
        this.instructorId = instructorId;
        this.courseForm.instructorId = instructorId;
        
        // Load instructor's courses using the dedicated endpoint
        this.courseService.getInstructorCourses().subscribe({
          next: (courses) => {
            this.courses = courses || [];
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading instructor courses:', error);
            this.snackBar.open('Error loading courses: ' + error.message, 'Close', { duration: 5000 });
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error getting instructor ID:', error);
        this.snackBar.open('Error loading instructor information: ' + error.message, 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  openCourseForm(course?: Course): void {
    if (course) {
      // Edit mode
      this.courseForm = {
        id: course.id || null,
        title: course.title,
        price: course.price,
        body: course.body,
        imageUrl: course.imageUrl,
        instructorId: this.instructorId
      };
    } else {
      // Add mode
      this.courseForm = {
        id: null,
        title: '',
        price: 0,
        body: '',
        imageUrl: '',
        instructorId: this.instructorId
      };
    }
    this.showCourseForm = true;
  }

  closeCourseForm(): void {
    this.showCourseForm = false;
    this.courseForm = {
      id: null,
      title: '',
      price: 0,
      body: '',
      imageUrl: '',
      instructorId: this.instructorId
    };
  }

  saveCourse(): void {
    if (!this.courseForm.title || !this.courseForm.body || this.courseForm.price < 0) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    const courseData: Course = {
      id: this.courseForm.id || 0,
      title: this.courseForm.title,
      price: this.courseForm.price,
      body: this.courseForm.body,
      imageUrl: this.courseForm.imageUrl,
      instructor: { id: this.instructorId } as any
    };

    if (this.courseForm.id) {
      // Update existing course
      this.courseService.updateCourse(courseData).subscribe({
        next: (response) => {
          this.snackBar.open('Course updated successfully!', 'Close', { duration: 3000 });
          this.closeCourseForm();
          this.loadInstructorCourses();
        },
        error: (error) => {
          console.error('Error updating course:', error);
          this.snackBar.open('Error updating course: ' + error.message, 'Close', { duration: 5000 });
        }
      });
    } else {
      // Create new course
      this.courseService.addCourse(courseData).subscribe({
        next: (response) => {
          this.snackBar.open('Course created successfully!', 'Close', { duration: 3000 });
          this.closeCourseForm();
          this.loadInstructorCourses();
        },
        error: (error) => {
          console.error('Error creating course:', error);
          this.snackBar.open('Error creating course: ' + error.message, 'Close', { duration: 5000 });
        }
      });
    }
  }

  deleteCourse(course: Course): void {
    if (!course.id) {
      this.snackBar.open('Invalid course ID', 'Close', { duration: 3000 });
      return;
    }
    
    if (confirm(`Are you sure you want to delete the course "${course.title}"? This action cannot be undone.`)) {
      this.courseService.deleteCourse(course.id).subscribe({
        next: (response) => {
          this.snackBar.open('Course deleted successfully!', 'Close', { duration: 3000 });
          this.loadInstructorCourses();
        },
        error: (error) => {
          console.error('Error deleting course:', error);
          this.snackBar.open('Error deleting course: ' + error.message, 'Close', { duration: 5000 });
        }
      });
    }
  }

  viewCourseContent(course: Course): void {
    this.router.navigate(['/instructor/courses', course.id, 'content']);
  }

  viewCourseDetails(course: Course): void {
    this.router.navigate(['/course-details', course.id]);
  }

  goBack(): void {
    this.router.navigate(['/instructor/profile']);
  }
}