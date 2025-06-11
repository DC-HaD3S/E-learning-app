import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { CourseService } from '../services/course.service';
import { loadCourses, loadCoursesSuccess, loadCoursesFailure } from '../state/course.actions';

@Injectable()
export class CourseEffects {
  constructor(
    private actions$: Actions,
    private courseService: CourseService
  ) {}

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
}