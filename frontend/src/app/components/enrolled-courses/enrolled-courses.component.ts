import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { Observable } from 'rxjs';
import { Course } from '../../models/course.model';
import { selectCourses, selectCourseError } from '../../state/course.selectors';
import { loadCourses } from '../../state/course.actions';

@Component({
  selector: 'app-enrolled-courses',
  templateUrl: './enrolled-courses.component.html',
  styleUrls: ['./enrolled-courses.component.css']
})
export class EnrolledCoursesComponent implements OnInit {
  courses$: Observable<Course[]>;
  error$: Observable<string | null>;
  sortedCourses: Course[] = [];

  constructor(private store: Store<AppState>) {
    this.courses$ = this.store.select(selectCourses);
    this.error$ = this.store.select(selectCourseError);
  }

  ngOnInit(): void {
    this.store.dispatch(loadCourses());
    this.courses$.subscribe(courses => {
      this.sortedCourses = [...courses].sort((a, b) => a.title.localeCompare(b.title));
    });
  }

  truncateBody(body: string | undefined, maxLength: number): string {
    if (!body) return ''; 
    return body.length > maxLength ? body.substring(0, maxLength) + '...' : body;
  }

  openDetailsDialog(course: Course): void {
    // Implement dialog opening logic if needed
  }
}