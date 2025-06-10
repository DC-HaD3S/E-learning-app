import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CourseDetailsDialogComponent } from '../course-details-dialog/course-details-dialog.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { Course } from '../../models/course.model';
import { UserRole } from '../../enums/user-role.enum'; 

@Component({
  selector: 'app-enrolled-courses',
  templateUrl: './enrolled-courses.component.html',
  styleUrls: ['./enrolled-courses.component.css']
})
export class EnrolledCoursesComponent implements OnInit {
  sortedCourses: Course[] = [];
  error$: Observable<string | null> = of(null);
  isAdmin$: Observable<boolean>;

  private courses: Course[] = [
    {
      id: 1,
      title: "Introduction to Angular",
      body: "Master Angular fundamentals, including components, directives, and services to build dynamic web applications.",
      imageUrl: "https://blog.solguruz.com/wp-content/uploads/2023/11/Top-Angular-Frameworks-for-Web-App-Development.png",
      price: 1050
    },
    {
      id: 2,
      title: "JavaScript Essentials",
      body: "Learn JavaScript basics like variables, loops, and functions to kickstart your programming journey.",
      imageUrl: "https://miro.medium.com/v2/resize:fit:1400/1*a3BHGbuAMpOaZj6HkTrNqA.png",
      price: 0
    },
    {
      id: 3,
      title: "Advanced TypeScript",
      body: "Explore TypeScript’s advanced features, including generics, interfaces, and type inference for robust code.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU-a7wFsQ0TqBnyvDwrAar9VklF8MLagTOag&s",
      price: 1079
    },
    {
      id: 4,
      title: "Full-Stack Web Development",
      body: "Build full-stack apps with HTML, CSS, JavaScript, Node.js, and MongoDB in this comprehensive bootcamp.",
      imageUrl: "https://jaro-website.s3.ap-south-1.amazonaws.com/2024/07/full-stack-web-developer.png",
      price: 1199
    }
  ];

  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>
  ) {
    this.isAdmin$ = this.store.select(state => state.auth?.role === UserRole.Admin);
  }

  ngOnInit(): void {
    this.sortedCourses = [...this.courses].sort((a, b) => a.title.localeCompare(b.title));
  }

  openApplyDialog(course: Course): void {
    this.dialog.open(CourseDetailsDialogComponent, {
      data: { course, action: 'apply' }
    });
  }

  openDetailsDialog(course: Course): void {
    this.dialog.open(CourseDetailsDialogComponent, {
      data: { course, action: 'details' }
    });
  }

  truncateBody(body: string, length: number = 50): string {
    if (body.length <= length) return body;
    return body.substring(0, length) + '...';
  }
}
