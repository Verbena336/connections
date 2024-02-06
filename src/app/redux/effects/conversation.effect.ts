import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { CountdownService } from 'src/app/connections/services/countdown.service';
import { ConversationService } from 'src/app/conversation/services/conversation.service';
import { ConversationResponse } from 'src/app/conversation/models/conversation.model';
import { ItemMessage } from '../state.model';
import { ConversationActions } from '../actions/conversation.actions';
import { selectSinceConversation } from '../selectors/conversation.selectors';

@Injectable()
export class ConversationEffects {
  getConversationMessages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ConversationActions.getConversationMessages),
      concatLatestFrom(() =>
        this.store.select(selectSinceConversation).pipe(take(1)),
      ),
      mergeMap(([{ conversationID, isInit, since }, storeSince]) => {
        const currentTime = String(new Date().getTime());

        return this.conversationService.getMessages(conversationID, since).pipe(
          map((res: ConversationResponse) => {
            return {
              res: this.formatConversationResponse(res),
              time: currentTime,
            };
          }),
          tap(({ res, time }) => {
            if (!isInit) {
              return this.coundownService.startTimer(conversationID);
            }
            return { res, time };
          }),
          mergeMap(({ res, time }) => {
            if (res.length) {
              return of(
                ConversationActions.getConversationMessagesSuccess({
                  conversationID,
                  messages: res,
                }),
                ConversationActions.setSince({
                  conversationID,
                  since: res.at(-1)?.createdAt || '',
                }),
              );
            }
            if (storeSince[conversationID]) {
              return of(
                ConversationActions.getConversationMessagesSuccess({
                  conversationID,
                  messages: res,
                }),
              );
            }
            return of(
              ConversationActions.getConversationMessagesSuccess({
                conversationID,
                messages: res,
              }),
              ConversationActions.setSince({
                conversationID,
                since: time,
              }),
            );
          }),
          catchError((error) => {
            return of(
              ConversationActions.getConversationMessagesFail({ error }),
            );
          }),
        );
      }),
    );
  });

  addNewMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ConversationActions.addConversationNewMessage),
      switchMap(({ conversationID, message }) =>
        this.conversationService.addMessage(conversationID, message).pipe(
          switchMap(() =>
            this.store.select(selectSinceConversation).pipe(take(1)),
          ),
          switchMap((res) => {
            if (conversationID && res[conversationID]) {
              return of(
                ConversationActions.getConversationMessages({
                  conversationID,
                  since: res[conversationID],
                  isInit: true,
                }),
              );
            }
            return of(
              ConversationActions.getConversationMessages({
                conversationID,
                isInit: true,
              }),
            );
          }),
          catchError((error) => {
            return of(
              ConversationActions.getConversationMessagesFail({ error }),
            );
          }),
        ),
      ),
    );
  });

  formatConversationResponse(data: ConversationResponse): ItemMessage[] {
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
    private store: Store,
    private coundownService: CountdownService,
    private conversationService: ConversationService,
  ) {}
}
