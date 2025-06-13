import { Component, OnInit } from '@angular/core';
import { InstructorService, InstructorApplication } from 'src/app/services/instructor.service';

@Component({
  selector: 'app-instructor-list',
  templateUrl: './instructor-list.component.html',
  styleUrls: ['./instructor-list.component.css']
})
export class InstructorListComponent implements OnInit {
  instructors: InstructorApplication[] = [];

  constructor(private instructorService: InstructorService) {}

  ngOnInit(): void {
    this.fetchApplications();
  }

  fetchApplications(): void {
    this.instructorService.getAllApplications().subscribe({
      next: (data) => {
        this.instructors = data;
      },
      error: (err) => {
        console.error('Failed to fetch instructor applications:', err);
      }
    });
  }
}
