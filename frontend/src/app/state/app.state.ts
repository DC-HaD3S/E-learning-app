
import { UserDetails } from '../services/auth.services';
import { UserRole } from '../enums/user-role.enum';
import { Course } from '../models/course.model';

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
  user: UserDetails | null;
}
