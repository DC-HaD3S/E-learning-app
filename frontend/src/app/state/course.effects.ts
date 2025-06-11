import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { CourseService } from '../services/course.service';
import * as CourseActions from './course.actions';

@Injectable()
export class CourseEffects {
  constructor(
    private actions$: Actions,
    private courseService: CourseService
  ) {}

  loadCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.loadCourses),
      mergeMap(() =>
        this.courseService.getCourses().pipe(
          map(courses => CourseActions.loadCoursesSuccess({ courses })),
          catchError(error => of(CourseActions.loadCoursesFailure({ error: error.message })))
        )
      )
    )
  );

  loadAdminCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.loadAdminCourses),
      mergeMap(() =>
        this.courseService.getAdminCourses().pipe(
          map(courses => CourseActions.loadAdminCoursesSuccess({ courses })),
          catchError(error => of(CourseActions.loadAdminCoursesFailure({ error: error.message })))
        )
      )
    )
  );

  addCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.addCourse),
      mergeMap(({ course }) =>
        this.courseService.addCourse(course).pipe(
          map(() => CourseActions.addCourseSuccess({ course })), // Return original course
          catchError(error => of(CourseActions.addCourseFailure({ error: error.message })))
        )
      )
    )
  );

  updateCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.updateCourse),
      mergeMap(({ course }) =>
        this.courseService.updateCourse(course).pipe(
          map(() => CourseActions.updateCourseSuccess({ course })), // Return original course
          catchError(error => of(CourseActions.updateCourseFailure({ error: error.message })))
        )
      )
    )
  );

  deleteCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.deleteCourse),
      mergeMap(({ courseId }) =>
        this.courseService.deleteCourse(courseId).pipe(
          map(() => CourseActions.deleteCourseSuccess({ courseId })),
          catchError(error => of(CourseActions.deleteCourseFailure({ error: error.message })))
        )
      )
    )
  );

  enrollUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.enrollUser),
      mergeMap(({ username, courseId, courseName }) =>
        this.courseService.enrollUser(username, courseId, courseName).pipe(
          map(() => CourseActions.enrollUserSuccess({ enrollment: { username, courseId, courseName } })),
          catchError(error => of(CourseActions.enrollUserFailure({ error: error.message })))
        )
      )
    )
  );

  loadEnrollments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.loadEnrollments),
      mergeMap(({ userId }) =>
        this.courseService.getEnrollments(userId).pipe(
          map(enrollments => CourseActions.loadEnrollmentsSuccess({ enrollments })),
          catchError(error => of(CourseActions.loadEnrollmentsFailure({ error: error.message })))
        )
      )
    )
  );
}