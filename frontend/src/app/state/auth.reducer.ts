import { createReducer, on } from '@ngrx/store';
import { setRole, clearRole } from './auth.actions';
import { UserRole } from '../enums/user-role.enum';

export interface AuthState {
  role: UserRole | null;
}

export const initialState: AuthState = { role: null };

export const authReducer = createReducer(
  initialState,
  on(setRole, (state, { role }) => ({ ...state, role })),
  on(clearRole, state => ({ ...state, role: null }))
);