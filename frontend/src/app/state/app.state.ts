import { Course } from '../models/course.model';
import { UserRole } from '../enums/user-role.enum';

export interface AppState {
  courses: CourseState;
  auth: AuthState;
}

export interface CourseState {
  courses: Course[];
  error: string | null;
}

export interface AuthState {
  role: UserRole | null;
}