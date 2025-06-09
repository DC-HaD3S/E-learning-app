import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8000/courses';

  constructor(private http: HttpClient) {}
getCourses(): Observable<Course[]> {
  return this.http.get<Course[]>(this.apiUrl);
}
  enrollUser(courseId: number, userId: number): Observable<boolean> {
    return new Observable(observer => {
      observer.next(true);
      observer.complete();
    });
  }
}