import { createReducer, on } from '@ngrx/store';
import { CourseState } from './app.state';
import { loadCourses, loadCoursesSuccess, loadCoursesFailure } from './course.actions';

export const initialCourseState: CourseState = {
  courses: [],
  error: null
};

export const courseReducer = createReducer(
  initialCourseState,
  on(loadCourses, state => ({ ...state, error: null })),
  on(loadCoursesSuccess, (state, { courses }) => ({ ...state, courses, error: null })),
  on(loadCoursesFailure, (state, { error }) => ({ ...state, error }))
);