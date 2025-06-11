import { createReducer, on } from '@ngrx/store';
import { Course } from '../models/course.model';
import { Enrollment } from '../models/enrollment.model';
import { loadCoursesSuccess, loadCoursesFailure, clearCourseError, addCourse, updateCourse, deleteCourse } from './course.actions';

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
  on(loadCoursesSuccess, (state, { courses }) => ({
    ...state,
    courses,
    error: null
  })),
  on(loadCoursesFailure, (state, { error }) => {
    console.log('Load Courses Failure:', error);
    return {
      ...state,
      error
    };
  }),
  on(clearCourseError, state => ({
    ...state,
    error: null
  })),
  on(addCourse, (state, { course }) => ({
    ...state,
    courses: [...state.courses, course],
    error: null
  })),
  on(updateCourse, (state, { course }) => ({
    ...state,
    courses: state.courses.map(c => c.id === course.id ? course : c),
    error: null
  })),
  on(deleteCourse, (state, { courseId }) => ({
    ...state,
    courses: state.courses.filter(c => c.id !== courseId),
    error: null
  }))
);