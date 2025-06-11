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
  props<{ course: Course }>()
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
  props<{ course: Course }>()
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
  props<{ courseId: number }>()
);
export const deleteCourseFailure = createAction(
  '[Course] Delete Course Failure',
  props<{ error: string }>()
);

export const enrollUser = createAction(
  '[Course] Enroll User',
  props<{ username: string; courseId: number; courseName: string }>()
);
export const enrollUserSuccess = createAction(
  '[Course] Enroll User Success',
  props<{ enrollment: Enrollment }>()
);
export const enrollUserFailure = createAction(
  '[Course] Enroll User Failure',
  props<{ error: string }>()
);

export const loadEnrollments = createAction(
  '[Course] Load Enrollments',
  props<{ userId: string }>()
);
export const loadEnrollmentsSuccess = createAction(
  '[Course] Load Enrollments Success',
  props<{ enrollments: Enrollment[] }>()
);
export const loadEnrollmentsFailure = createAction(
  '[Course] Load Enrollments Failure',
  props<{ error: string }>()
);

export const clearCourseError = createAction('[Course] Clear Course Error');