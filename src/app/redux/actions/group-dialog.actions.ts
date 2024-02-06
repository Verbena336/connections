import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IError, ItemMessage } from '../state.model';

export const GroupDialogActions = createActionGroup({
  source: 'GroupDialog',
  events: {
    'Get Group Messages': props<{
      groupID: string;
      isInit?: boolean;
      since?: string;
    }>(),
    'Get Group Messages success': props<{
      groupID: string;
      messages: ItemMessage[];
    }>(),
    'Get Group Messages fail': props<{ error: IError }>(),
    'Add Group New Message': props<{
      groupID: string;
      message: string;
    }>(),
    'Set Since': props<{ groupID: string; since: string }>(),
    'Delete Group': props<{ groupID: string }>(),
    'Update Groups': props<{ groupsIDs: string[] }>(),
    'Delete Group Messages': emptyProps(),
  },
});
