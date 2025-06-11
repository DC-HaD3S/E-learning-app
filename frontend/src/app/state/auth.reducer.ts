
import { createReducer, on } from '@ngrx/store';
import { setRole, clearRole, setUserDetails } from './auth.actions';
import { AuthState } from './app.state';

export const initialState: AuthState = {
  role: null,
  user: null
};

export const authReducer = createReducer(
  initialState,
  on(setRole, (state, { role }) => ({ ...state, role })),
  on(clearRole, state => ({ ...state, role: null })),
  on(setUserDetails, (state, { userDetails }) => ({ ...state, user: userDetails }))
);