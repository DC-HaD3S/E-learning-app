import { createReducer, on } from '@ngrx/store';
import { CourseState } from './app.state';
import * as CourseActions from './course.actions';

export const initialCourseState: CourseState = {
  courses: [],
  enrollments: [],
  error: null,
  message: null
};
export const courseReducer = createReducer(
  initialCourseState,
  on(CourseActions.loadCourses, state => {
    console.log('Load Courses Action:', state);
    return { ...state, error: null, message: null };
  }),
  on(CourseActions.loadCoursesSuccess, (state, { courses }) => {
    console.log('Load Courses Success:', courses);
    return { ...state, courses, error: null, message: null };
  }),
  on(CourseActions.loadCoursesFailure, (state, { error }) => {
    console.log('Load Courses Failure:', error);
    return { ...state, error, message: null };
  }),
  on(CourseActions.loadAdminCourses, state => ({ ...state, error: null, message: null })),
  on(CourseActions.loadAdminCoursesSuccess, (state, { courses }) => ({ ...state, courses, error: null, message: null })),
  on(CourseActions.loadAdminCoursesFailure, (state, { error }) => ({ ...state, error, message: null })),

  on(CourseActions.addCourse, state => ({ ...state, error: null, message: null })),
  on(CourseActions.addCourseSuccess, (state, { message }) => ({ ...state, error: null, message })),
  on(CourseActions.addCourseFailure, (state, { error }) => ({ ...state, error, message: null })),

  on(CourseActions.updateCourse, state => ({ ...state, error: null, message: null })),
  on(CourseActions.updateCourseSuccess, (state, { message }) => ({ ...state, error: null, message })),
  on(CourseActions.updateCourseFailure, (state, { error }) => ({ ...state, error, message: null })),

  on(CourseActions.deleteCourse, state => ({ ...state, error: null, message: null })),
  on(CourseActions.deleteCourseSuccess, (state, { message }) => ({ ...state, error: null, message })),
  on(CourseActions.deleteCourseFailure, (state, { error }) => ({ ...state, error, message: null })),

  on(CourseActions.enrollUser, state => ({ ...state, error: null, message: null })),
  on(CourseActions.enrollUserSuccess, (state, { message }) => ({ ...state, error: null, message })),
  on(CourseActions.enrollUserFailure, (state, { error }) => ({ ...state, error, message: null })),

  on(CourseActions.loadEnrollments, state => ({ ...state, error: null, message: null })),
  on(CourseActions.loadEnrollmentsSuccess, (state, { enrollments }) => ({ ...state, enrollments, error: null, message: null })),
  on(CourseActions.loadEnrollmentsFailure, (state, { error }) => ({ ...state, error, message: null }))
);