import { UserRole } from '../enums/user-role.enum';

export interface User {
  username: string;
  role: UserRole;
}