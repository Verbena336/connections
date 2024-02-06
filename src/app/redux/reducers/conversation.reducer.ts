import { createReducer, on } from '@ngrx/store';
import { ConversationsMessages } from '../state.model';
import { ConversationActions } from '../actions/conversation.actions';

export const conversationFeatureKey = 'conversationsMessages';

export const initialState: ConversationsMessages = {
  messagesData: {},
  isLoading: false,
  isError: null,
  since: {},
};

export const reducer = createReducer(
  initialState,
  on(
    ConversationActions.getConversationMessages,
    (state): ConversationsMessages => ({
      ...state,
      isLoading: true,
      isError: null,
    }),
  ),
  on(
    ConversationActions.getConversationMessagesSuccess,
    (state, { conversationID, messages }): ConversationsMessages => ({
      ...state,
      isLoading: false,
      messagesData: {
        ...state.messagesData,
        [conversationID]: [
          ...(state.messagesData[conversationID] || []),
          ...messages,
        ],
      },
    }),
  ),
  on(
    ConversationActions.getConversationMessagesFail,
    (state, action): ConversationsMessages => ({
      ...state,
      isLoading: false,
      isError: { ...action.error },
    }),
  ),
  on(
    ConversationActions.deleteConversation,
    (state, { conversationID }): ConversationsMessages => {
      const updatedMessagesData = { ...state.messagesData };
      delete updatedMessagesData[conversationID];
      const updatedSince = { ...state.since };
      delete updatedSince[conversationID];
      return {
        ...state,
        isLoading: false,
        messagesData: {
          ...updatedMessagesData,
        },
        since: { ...updatedSince },
      };
    },
  ),
  on(
    ConversationActions.updateConversations,
    (state, { conversationsIDs }): ConversationsMessages => {
      const updatedMessagesData = { ...state.messagesData };
      const updatedSince = { ...state.since };

      Object.entries(updatedMessagesData).forEach(([id]) => {
        if (!conversationsIDs.includes(id)) {
          return delete updatedMessagesData[id];
        }
        return undefined;
      });

      Object.entries(updatedSince).forEach(([id]) => {
        if (!conversationsIDs.includes(id)) {
          return delete updatedSince[id];
        }
        return undefined;
      });

      return {
        ...state,
        isLoading: false,
        messagesData: {
          ...updatedMessagesData,
        },
        since: { ...updatedSince },
      };
    },
  ),
  on(
    ConversationActions.deleteConversationsList,
    (): ConversationsMessages => ({
      ...initialState,
    }),
  ),
  on(
    ConversationActions.setSince,
    (state, action): ConversationsMessages => ({
      ...state,
      since: {
        ...state.since,
        [action.conversationID]: action.since,
      },
    }),
  ),
);
