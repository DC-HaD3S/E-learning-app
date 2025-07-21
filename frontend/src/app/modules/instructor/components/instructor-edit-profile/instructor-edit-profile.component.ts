import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InstructorService } from 'src/app/shared/services/instructor.service';
import { Instructor } from 'src/app/shared/models/instructor-application.model';
import { AuthService } from 'src/app/auth/auth.services';

@Component({
  selector: 'app-instructor-edit-profile',
  templateUrl: './instructor-edit-profile.component.html',
  styleUrls: ['./instructor-edit-profile.component.css']
})
export class InstructorEditProfileComponent implements OnInit {
  profileForm: FormGroup;
  instructor: Instructor | null = null;
  isLoading = false;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private instructorService: InstructorService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', [Validators.required]],
      profileImageUrl: [''],
      twitterHandle: [''],
      githubHandle: ['']
    });
  }

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
        this.profileForm.patchValue({
          name: instructor.name,
          email: instructor.email,
          bio: instructor.bio,
          profileImageUrl: instructor.profileImageUrl || '',
          twitterHandle: instructor.twitterHandle || '',
          githubHandle: instructor.githubHandle || ''
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading instructor profile:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.instructor) {
      this.isSaving = true;
      const updatedInstructor: Instructor = {
        ...this.instructor,
        ...this.profileForm.value
      };

      this.instructorService.updateInstructor(updatedInstructor).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/instructor/profile']);
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.isSaving = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/instructor/profile']);
  }
}