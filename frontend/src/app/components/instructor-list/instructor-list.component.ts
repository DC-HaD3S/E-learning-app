import { Component, OnInit } from '@angular/core';
import { InstructorService, InstructorApplication } from 'src/app/services/instructor.service';

@Component({
  selector: 'app-instructor-list',
  templateUrl: './instructor-list.component.html',
  styleUrls: ['./instructor-list.component.css']
})
export class InstructorListComponent implements OnInit {
  instructors: InstructorApplication[] = [];
  sortField: string = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private instructorService: InstructorService) {}

  ngOnInit(): void {
    this.fetchApplications();
  }

  fetchApplications(): void {
    this.instructorService.getAllApplications().subscribe({
      next: (data) => {
        this.instructors = data;
        this.sortInstructors(); // initial sort
      },
      error: (err) => {
        console.error('Failed to fetch instructor applications:', err);
      }
    });
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortInstructors();
  }

  sortInstructors(): void {
    this.instructors.sort((a, b) => {
      const fieldA = (a as any)[this.sortField]?.toString().toLowerCase() ?? '';
      const fieldB = (b as any)[this.sortField]?.toString().toLowerCase() ?? '';

      if (fieldA < fieldB) return this.sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }
}