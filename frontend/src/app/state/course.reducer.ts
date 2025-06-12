import { createReducer, on } from '@ngrx/store';
import { Course } from '../models/course.model';
import { Enrollment } from '../models/enrollment.model';
import {
  loadCourses, clearCourseError, addCourse, updateCourse, deleteCourse,
  loadCoursesSuccess, loadCoursesFailure,
  loadEnrollments, loadEnrollmentsSuccess, loadEnrollmentsFailure,
  enrollUser, enrollUserSuccess, enrollUserFailure
} from './course.actions';

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
  on(loadCourses, state => ({ ...state, error: null, message: null })),
  on(loadCoursesSuccess, (state, { courses }) => ({
    ...state,
    courses,
    error: null
  })),
  on(loadCoursesFailure, (state, { error }) => {
    console.log('Load Courses Failure:', error);
    return { ...state, error };
  }),
  on(clearCourseError, state => ({
    ...state,
    error: null
  })),
  on(addCourse, (state, { course }) => ({
    ...state,
    courses: [...state.courses, course],
    error: null,
    message: 'Course added successfully'
  })),
  on(updateCourse, (state, { course }) => ({
    ...state,
    courses: state.courses.map(c => c.id === course.id ? course : c),
    error: null,
    message: 'Course updated successfully'
  })),
  on(deleteCourse, (state, { courseId }) => ({
    ...state,
    courses: state.courses.filter(c => c.id !== courseId),
    error: null,
    message: 'Course deleted successfully'
  })),
  on(loadEnrollments, state => ({ ...state, error: null, message: null })),
  on(loadEnrollmentsSuccess, (state, { enrollments }) => ({
    ...state,
    enrollments,
    error: null
  })),
  on(loadEnrollmentsFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(enrollUser, state => ({ ...state, error: null, message: null })),
  on(enrollUserSuccess, (state, { enrollment }) => ({
    ...state,
    enrollments: [...state.enrollments, enrollment],
    error: null,
    message: 'Enrolled successfully'
  })),
  on(enrollUserFailure, (state, { error }) => ({
    ...state,
    error
  }))
);