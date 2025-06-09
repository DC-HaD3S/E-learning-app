import { createSelector } from '@ngrx/store';
import { AppState } from './app.state';
import { CourseState } from './app.state';

export const selectCourseState = (state: AppState) => state.courses;

export const selectCourses = createSelector(
  selectCourseState,
  (state: CourseState) => state.courses
);

export const selectCourseError = createSelector(
  selectCourseState,
  (state: CourseState) => state.error
);