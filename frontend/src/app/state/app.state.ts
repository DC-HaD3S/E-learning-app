
import { UserDetails } from '../services/auth.services';
import { UserRole } from '../enums/user-role.enum';
import { Course } from '../models/course.model';
import { Enrollment } from '../models/enrollment.model';


export interface CourseState {
  courses: Course[];
  enrollments: Enrollment[];
  error: string | null;
  message: string | null;
}
export interface AppState {
  courses: CourseState;
  auth: AuthState;
}



export interface AuthState {
  role: UserRole | null;
  user: UserDetails | null;
}