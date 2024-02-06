import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserProfile } from '../state.model';

export const selectProfile = createFeatureSelector<UserProfile>('userProfile');

export const selectIsLoadingProfile = createSelector(
  selectProfile,
  (state) => state.isLoading,
);
export const selectUserData = createSelector(
  selectProfile,
  (state) => state.userData,
);
export const selectIsError = createSelector(
  selectProfile,
  (state) => state.isError,
);
