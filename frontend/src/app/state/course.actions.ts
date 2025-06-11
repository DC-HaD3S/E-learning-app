import { createAction, props } from '@ngrx/store';
import { Course } from '../models/course.model';
import { Enrollment } from '../models/enrollment.model';

export const loadCourses = createAction('[Course] Load Courses');
export const loadCoursesSuccess = createAction(
  '[Course] Load Courses Success',
  props<{ courses: Course[] }>()
);
export const loadCoursesFailure = createAction(
  '[Course] Load Courses Failure',
  props<{ error: string }>()
);

export const loadAdminCourses = createAction('[Course] Load Admin Courses');
export const loadAdminCoursesSuccess = createAction(
  '[Course] Load Admin Courses Success',
  props<{ courses: Course[] }>()
);
export const loadAdminCoursesFailure = createAction(
  '[Course] Load Admin Courses Failure',
  props<{ error: string }>()
);

export const addCourse = createAction(
  '[Course] Add Course',
  props<{ course: Course }>()
);
export const addCourseSuccess = createAction(
  '[Course] Add Course Success',
  props<{ message: string }>()
);
export const addCourseFailure = createAction(
  '[Course] Add Course Failure',
  props<{ error: string }>()
);

export const updateCourse = createAction(
  '[Course] Update Course',
  props<{ course: Course }>()
);
export const updateCourseSuccess = createAction(
  '[Course] Update Course Success',
  props<{ message: string }>()
);
export const updateCourseFailure = createAction(
  '[Course] Update Course Failure',
  props<{ error: string }>()
);

export const deleteCourse = createAction(
  '[Course] Delete Course',
  props<{ courseId: number }>()
);
export const deleteCourseSuccess = createAction(
  '[Course] Delete Course Success',
  props<{ message: string }>()
);
export const deleteCourseFailure = createAction(
  '[Course] Delete Course Failure',
  props<{ error: string }>()
);

export const enrollUser = createAction(
  '[Enrollment] Enroll User',
  props<{ username: string; courseId: number; courseName: string }>()
);
export const enrollUserSuccess = createAction(
  '[Enrollment] Enroll User Success',
  props<{ message: string }>()
);
export const enrollUserFailure = createAction(
  '[Enrollment] Enroll User Failure',
  props<{ error: string }>()
);

export const loadEnrollments = createAction(
  '[Enrollment] Load Enrollments',
  props<{ userId: number }>()
);
export const loadEnrollmentsSuccess = createAction(
  '[Enrollment] Load Enrollments Success',
  props<{ enrollments: Enrollment[] }>()
);
export const loadEnrollmentsFailure = createAction(
  '[Enrollment] Load Enrollments Failure',
  props<{ error: string }>()
);