import { createReducer, on } from '@ngrx/store';
import { UserProfile } from '../state.model';

import { UserProfileActions } from '../actions/user-profile.actions';

export const userProfileFeatureKey = 'userProfile';

export const initialState: UserProfile = {
  userData: {
    uid: '',
    email: '',
    createdAt: '',
    name: '',
  },
  isLoading: false,
  isError: null,
};

export const reducer = createReducer(
  initialState,
  on(
    UserProfileActions.getUserProfile,
    (state): UserProfile => ({
      ...state,
      isLoading: true,
      isError: null,
    }),
  ),
  on(
    UserProfileActions.getUserProfileSuccess,
    (state, action): UserProfile => ({
      ...state,
      userData: {
        ...action.userProfile,
      },
      isLoading: false,
    }),
  ),
  on(
    UserProfileActions.getUserProfileFail,
    (state, action): UserProfile => ({
      ...state,
      isLoading: false,
      isError: { ...action.error },
    }),
  ),
  on(
    UserProfileActions.updateUserName,
    (state): UserProfile => ({
      ...state,
      isLoading: true,
      isError: null,
    }),
  ),
  on(
    UserProfileActions.updateUserNameSuccess,
    (state, action): UserProfile => ({
      ...state,
      userData: {
        ...state.userData,
        name: action.name,
      },
      isLoading: false,
    }),
  ),
  on(
    UserProfileActions.updateUserNameFail,
    (state, action): UserProfile => ({
      ...state,
      isLoading: false,
      isError: { ...action.error },
    }),
  ),
  on(
    UserProfileActions.deleteUserData,
    (): UserProfile => ({
      ...initialState,
    }),
  ),
);
