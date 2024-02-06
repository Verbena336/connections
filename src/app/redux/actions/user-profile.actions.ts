import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IError, UserData } from '../state.model';

export const UserProfileActions = createActionGroup({
  source: 'UserProfile',
  events: {
    'Get User Profile': emptyProps(),
    'Get User Profile success': props<{ userProfile: UserData }>(),
    'Get User Profile fail': props<{ error: IError }>(),
    'Update User Name': props<{ name: string }>(),
    'Update User Name success': props<{ name: string }>(),
    'Update User Name fail': props<{ error: IError }>(),
    'Delete User Data': emptyProps(),
  },
});
