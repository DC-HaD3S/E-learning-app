import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CourseService } from '../services/course.service';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import {
  loadCourses, loadCoursesSuccess, loadCoursesFailure,
  addCourse, updateCourse, deleteCourse,
  loadEnrollments, loadEnrollmentsSuccess, loadEnrollmentsFailure,
  enrollUser, enrollUserSuccess, enrollUserFailure
} from './course.actions';

@Injectable()
export class CourseEffects {
  loadCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCourses),
      mergeMap(() =>
        this.courseService.getCourses().pipe(
          map(courses => loadCoursesSuccess({ courses })),
          catchError(error => of(loadCoursesFailure({ error: error.message })))
        )
      )
    )
  );

  addCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCourse),
      mergeMap(({ course }) =>
        this.courseService.addCourse(course).pipe(
          map(response => addCourse({ course: response.data })),
          catchError(error => of(loadCoursesFailure({ error: error.message })))
        )
      )
    )
  );

  updateCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCourse),
      mergeMap(({ course }) =>
        this.courseService.updateCourse(course).pipe(
          map(response => updateCourse({ course: response.data })),
          catchError(error => of(loadCoursesFailure({ error: error.message })))
        )
      )
    )
  );

  deleteCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteCourse),
      mergeMap(({ courseId }) =>
        this.courseService.deleteCourse(courseId).pipe(
          map(() => deleteCourse({ courseId })),
          catchError(error => of(loadCoursesFailure({ error: error.message })))
        )
      )
    )
  );

  loadEnrollments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadEnrollments),
      mergeMap(() =>
        this.courseService.getEnrolledCourses().pipe(
          map(enrollments => loadEnrollmentsSuccess({ enrollments })),
          catchError(error => of(loadEnrollmentsFailure({ error: error.message })))
        )
      )
    )
  );

  enrollUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(enrollUser),
      mergeMap(({ courseId, courseName }) =>
        this.courseService.enrollUser(courseId, courseName).pipe(
          map(response => enrollUserSuccess({
            enrollment: {
              username: '', 
              courseId,
              courseName
            }
          })),
          catchError(error => of(enrollUserFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private courseService: CourseService) {}
}