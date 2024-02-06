import { createReducer, on } from '@ngrx/store';
import { GroupDialogActions } from '../actions/group-dialog.actions';
import { GroupsMessages } from '../state.model';

export const groupsDialogFeatureKey = 'groupsMessages';

export const initialState: GroupsMessages = {
  messagesData: {},
  isLoading: false,
  isError: null,
  since: {},
};

export const reducer = createReducer(
  initialState,
  on(
    GroupDialogActions.getGroupMessages,
    (state): GroupsMessages => ({
      ...state,
      isLoading: true,
      isError: null,
    }),
  ),
  on(
    GroupDialogActions.getGroupMessagesSuccess,
    (state, { groupID, messages }): GroupsMessages => ({
      ...state,
      isLoading: false,
      messagesData: {
        ...state.messagesData,
        [groupID]: [...(state.messagesData[groupID] || []), ...messages],
      },
    }),
  ),
  on(
    GroupDialogActions.getGroupMessagesFail,
    (state, action): GroupsMessages => ({
      ...state,
      isLoading: false,
      isError: { ...action.error },
    }),
  ),
  on(
    GroupDialogActions.deleteGroupMessages,
    (): GroupsMessages => ({
      ...initialState,
    }),
  ),
  on(
    GroupDialogActions.setSince,
    (state, action): GroupsMessages => ({
      ...state,
      since: {
        ...state.since,
        [action.groupID]: action.since,
      },
    }),
  ),
  on(
    GroupDialogActions.updateGroups,
    (state, { groupsIDs }): GroupsMessages => {
      const updatedMessagesData = { ...state.messagesData };
      const updatedSince = { ...state.since };

      Object.entries(updatedMessagesData).forEach(([id]) => {
        if (!groupsIDs.includes(id)) {
          return delete updatedMessagesData[id];
        }
        return undefined;
      });

      Object.entries(updatedSince).forEach(([id]) => {
        if (!groupsIDs.includes(id)) {
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
  on(GroupDialogActions.deleteGroup, (state, { groupID }): GroupsMessages => {
    const updatedMessagesData = { ...state.messagesData };
    delete updatedMessagesData[groupID];
    const updatedSince = { ...state.since };
    delete updatedSince[groupID];
    return {
      ...state,
      isLoading: false,
      messagesData: {
        ...updatedMessagesData,
      },
      since: { ...updatedSince },
    };
  }),
);
