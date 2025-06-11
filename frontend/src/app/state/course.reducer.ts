import { createReducer, on } from '@ngrx/store';
import { Course } from '../models/course.model';
import { Enrollment } from '../models/enrollment.model';
import * as CourseActions from './course.actions';

export interface CourseState {
  courses: Course[];
  enrollments: Enrollment[];
  error: string | null;
  message: string | null;
}

const initialState: CourseState = {
  courses: [],
  enrollments: [],
  error: null,
  message: null
};

export const courseReducer = createReducer(
  initialState,
  on(CourseActions.loadCoursesSuccess, (state, { courses }) => ({
    ...state,
    courses,
    error: null,
    message: null
  })),
  on(CourseActions.loadCoursesFailure, (state, { error }) => ({
    ...state,
    error,
    message: null
  })),
  on(CourseActions.loadAdminCoursesSuccess, (state, { courses }) => ({
    ...state,
    courses,
    error: null,
    message: null
  })),
  on(CourseActions.loadAdminCoursesFailure, (state, { error }) => ({
    ...state,
    error,
    message: null
  })),
  on(CourseActions.addCourseSuccess, (state, { course }) => ({
    ...state,
    courses: [...state.courses, course],
    error: null,
    message: 'Course added successfully'
  })),
  on(CourseActions.addCourseFailure, (state, { error }) => ({
    ...state,
    error,
    message: null
  })),
  on(CourseActions.updateCourseSuccess, (state, { course }) => ({
    ...state,
    courses: state.courses.map(c => c.id === course.id ? course : c),
    error: null,
    message: 'Course updated successfully'
  })),
  on(CourseActions.updateCourseFailure, (state, { error }) => ({
    ...state,
    error,
    message: null
  })),
  on(CourseActions.deleteCourseSuccess, (state, { courseId }) => ({
    ...state,
    courses: state.courses.filter(c => c.id !== courseId),
    error: null,
    message: 'Course deleted successfully'
  })),
  on(CourseActions.deleteCourseFailure, (state, { error }) => ({
    ...state,
    error,
    message: null
  })),
  on(CourseActions.enrollUserSuccess, (state, { enrollment }) => ({
    ...state,
    enrollments: [...state.enrollments, enrollment],
    error: null,
    message: 'Enrollment successful'
  })),
  on(CourseActions.enrollUserFailure, (state, { error }) => ({
    ...state,
    error,
    message: null
  })),
  on(CourseActions.loadEnrollmentsSuccess, (state, { enrollments }) => ({
    ...state,
    enrollments,
    error: null,
    message: null
  })),
  on(CourseActions.loadEnrollmentsFailure, (state, { error }) => ({
    ...state,
    error,
    message: null
  })),
  on(CourseActions.clearCourseError, state => ({
    ...state,
    error: null,
    message: null
  }))
);