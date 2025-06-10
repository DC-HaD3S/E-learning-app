import { createAction, props } from '@ngrx/store';
import { UserRole } from '../enums/user-role.enum';

export const setRole = createAction('[Auth] Set role]', props<{ role: UserRole }>());
export const clearRole = createAction('[Auth] Clear role');