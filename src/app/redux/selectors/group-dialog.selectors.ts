import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GroupsMessages } from '../state.model';

export const selectGroupsMessages =
  createFeatureSelector<GroupsMessages>('groupsMessages');

export const selectIsLoadingMessages = createSelector(
  selectGroupsMessages,
  (state) => state.isLoading,
);
export const selectGroupsMessagesData = createSelector(
  selectGroupsMessages,
  (state) => state.messagesData,
);
export const selectIsErrorMessages = createSelector(
  selectGroupsMessages,
  (state) => state.isError,
);

export const selectSinceGroup = createSelector(
  selectGroupsMessages,
  (state) => state.since,
);
