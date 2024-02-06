import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConversationsMessages } from '../state.model';

export const selectConversationsMessages =
  createFeatureSelector<ConversationsMessages>('conversationsMessages');

export const selectIsLoadingMessages = createSelector(
  selectConversationsMessages,
  (state) => state.isLoading,
);
export const selectConversationsMessagesData = createSelector(
  selectConversationsMessages,
  (state) => state.messagesData,
);
export const selectIsErrorMessages = createSelector(
  selectConversationsMessages,
  (state) => state.isError,
);
export const selectSinceConversation = createSelector(
  selectConversationsMessages,
  (state) => state.since,
);
