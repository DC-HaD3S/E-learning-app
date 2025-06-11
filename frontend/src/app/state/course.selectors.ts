import { createSelector } from '@ngrx/store';
import { AppState } from './app.state';
import { CourseState } from './course.reducer';

export const selectCourseState = (state: AppState) => state.courses;

export const selectCourses = createSelector(
  selectCourseState,
  (state: CourseState) => state.courses
);

export const selectEnrollments = createSelector(
  selectCourseState,
  (state: CourseState) => state.enrollments
);

export const selectCourseError = createSelector(
  selectCourseState,
  (state: CourseState) => state.error
);

export const selectCourseMessage = createSelector(
  selectCourseState,
  (state: CourseState) => state.message
);