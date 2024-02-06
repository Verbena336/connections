import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IError, ItemMessage } from '../state.model';

export const ConversationActions = createActionGroup({
  source: 'Conversation',
  events: {
    'Get Conversation Messages': props<{
      conversationID: string;
      isInit?: boolean;
      since?: string;
    }>(),
    'Get Conversation Messages success': props<{
      conversationID: string;
      messages: ItemMessage[];
    }>(),
    'Get Conversation Messages fail': props<{ error: IError }>(),
    'Add Conversation New Message': props<{
      conversationID: string;
      message: string;
    }>(),
    'Set Since': props<{ conversationID: string; since: string }>(),
    'Delete Conversation': props<{ conversationID: string }>(),
    'Update Conversations': props<{ conversationsIDs: string[] }>(),
    'Delete Conversations List': emptyProps(),
  },
});
