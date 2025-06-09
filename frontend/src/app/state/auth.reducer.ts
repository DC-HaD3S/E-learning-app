import { createReducer, on } from '@ngrx/store';
import { AuthState } from './app.state';
import { setRole, clearRole } from './auth.actions';

export const initialAuthState: AuthState = {
  role: null
};

export const authReducer = createReducer(
  initialAuthState,
  on(setRole, (state, { role }) => ({ ...state, role })),
  on(clearRole, state => ({ ...state, role: null }))
);