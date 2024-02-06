import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, concatLatestFrom } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, take, tap } from 'rxjs';
import { GroupDialogService } from 'src/app/group/services/group-dialog.service';
import { GroupDialogResponse } from 'src/app/group/models/group-dialog.model';
import { Store } from '@ngrx/store';
import { CountdownService } from 'src/app/connections/services/countdown.service';
import { GroupDialogActions } from '../actions/group-dialog.actions';
import { ItemMessage } from '../state.model';
import { selectSinceGroup } from '../selectors/group-dialog.selectors';

@Injectable()
export class GroupsDialogEffects {
  // Variant for no since request for tests
  // getGroupMessages$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(GroupDialogActions.getGroupMessages),
  //     mergeMap(({ groupID, isInit, since }) => {
  //       return concat(
  //         // of(
  //         //   GroupDialogActions.setSince({
  //         //     groupID,
  //         //     since: String(new Date().getTime()),
  //         //   }),
  //         // ),
  //         this.groupDialogService.getMessages(groupID, since).pipe(
  //           map((res: GroupDialogResponse) => {
  //             return this.formatGroupResponse(res);
  //           }),
  //           tap((res) => {
  //             if (!isInit) {
  //               return this.coundownService.startTimer(groupID);
  //             }
  //             return res;
  //           }),
  //           map((res) =>
  //             GroupDialogActions.getGroupMessagesSuccess({
  //               groupID,
  //               messages: res,
  //             }),
  //           ),
  //           catchError((error) => {
  //             return of(GroupDialogActions.getGroupMessagesFail({ error }));
  //           }),
  //         ),
  //       );
  //     }),
  //   );
  // });

  getGroupMessages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupDialogActions.getGroupMessages),
      concatLatestFrom(() => this.store.select(selectSinceGroup).pipe(take(1))),
      mergeMap(([{ groupID, isInit, since }, storeSince]) => {
        const currentTime = String(new Date().getTime());

        return this.groupDialogService.getMessages(groupID, since).pipe(
          map((res: GroupDialogResponse) => {
            return { res: this.formatGroupResponse(res), time: currentTime };
          }),
          tap(({ res, time }) => {
            if (!isInit) {
              return this.coundownService.startTimer(groupID);
            }
            return { res, time };
          }),
          mergeMap(({ res, time }) => {
            if (res.length) {
              return of(
                GroupDialogActions.getGroupMessagesSuccess({
                  groupID,
                  messages: res,
                }),
                GroupDialogActions.setSince({
                  groupID,
                  since: res.at(-1)?.createdAt || '',
                }),
              );
            }
            if (storeSince[groupID]) {
              return of(
                GroupDialogActions.getGroupMessagesSuccess({
                  groupID,
                  messages: res,
                }),
              );
            }
            return of(
              GroupDialogActions.getGroupMessagesSuccess({
                groupID,
                messages: res,
              }),
              GroupDialogActions.setSince({
                groupID,
                since: time,
              }),
            );
          }),
          catchError((error) => {
            return of(GroupDialogActions.getGroupMessagesFail({ error }));
          }),
        );
      }),
    );
  });

  addNewMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupDialogActions.addGroupNewMessage),
      switchMap(({ groupID, message }) =>
        this.groupDialogService.addMessage(groupID, message).pipe(
          concatLatestFrom(() => this.store.select(selectSinceGroup)),
          map(([, res]) => {
            if (groupID && res[groupID]) {
              return GroupDialogActions.getGroupMessages({
                groupID,
                since: res[groupID],
                isInit: true,
              });
            }
            return GroupDialogActions.getGroupMessages({
              groupID,
              isInit: true,
            });
          }),
          catchError((error) => {
            return of(GroupDialogActions.getGroupMessagesFail({ error }));
          }),
        ),
      ),
    );
  });

  formatGroupResponse(data: GroupDialogResponse): ItemMessage[] {
    return data.Items.map((item) => {
      return {
        authorID: item.authorID.S,
        message: item.message.S,
        createdAt: item.createdAt.S,
      };
    }).sort((a, b) => +a.createdAt - +b.createdAt);
  }

  constructor(
    private actions$: Actions,
    private groupDialogService: GroupDialogService,
    private store: Store,
    private coundownService: CountdownService,
  ) {}
}
