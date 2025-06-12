import { UserRole } from '../enums/user-role.enum';

export interface User {
  id?: number; // Optional, if UserDTO includes it
  name?: string; // Optional, if UserDTO includes it
  email?: string; // Optional, if UserDTO includes it
  username: string;
  role: UserRole;
  password?: string; // Optional, if UserDTO includes it
}