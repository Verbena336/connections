import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, map, tap, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { ConversationActions } from 'src/app/redux/actions/conversation.actions';
import {
  ConversationListResponse,
  ConversationResponse,
  CreateConversationResponse,
  ItemListConversation,
  ItemListConversationResponse,
} from '../models/conversation.model';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  private conversationsSubject = new BehaviorSubject<ItemListConversation[]>(
    [],
  );

  private conversationListLoadedSubject = new BehaviorSubject<boolean>(false);

  public conversations$ = this.conversationsSubject.asObservable();

  public conversationListLoaded$ =
    this.conversationListLoadedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private store: Store,
  ) {}

  getMessages(id: string, since?: string) {
    let params = new HttpParams().append('conversationID', id);
    if (since) {
      params = params.append('since', since);
    }
    return this.http.get<ConversationResponse>(
      environment.CONVERSATION_MESSAGES,
      {
        params,
      },
    );
  }

  addMessage(conversationID: string, message: string) {
    return this.http.post(environment.ADD_CONVERSATION_MESSAGE, {
      conversationID,
      message,
    });
  }

  refreshConversations() {
    this.conversationsSubject.next([]);
    this.conversationListLoadedSubject.next(false);
  }

  getConversations() {
    return this.http
      .get<ConversationListResponse>(environment.CONVERSATIONS_LIST)
      .pipe(
        map((conv) => this.formatItems(conv.Items)),
        tap((conv) => {
          this.conversationListLoadedSubject.next(true);
          this.conversationsSubject.next(conv);
          const idArray = conv.map((obj) => obj.id);
          this.store.dispatch(
            ConversationActions.updateConversations({
              conversationsIDs: idArray,
            }),
          );
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  createConversation(companion: string) {
    return this.http
      .post<CreateConversationResponse>(environment.CONVERSATIONS_CREATE, {
        companion,
      })
      .pipe(catchError((error) => throwError(() => error)));
  }

  isCreatedConversation(id: string) {
    return this.conversationsSubject.value.find(
      (elem) => elem.companionID === id,
    );
  }

  addConversation(id: string, companionID: string) {
    return this.conversationsSubject.next([
      ...this.conversationsSubject.value,
      { id, companionID },
    ]);
  }

  deleteConversation(id: string) {
    const params = new HttpParams().append('conversationID', id);
    return this.http
      .delete<void>(environment.CONVERSATION_DELETE, { params })
      .pipe(
        tap(() => this.removeConversation(id)),
        catchError((error) => throwError(() => error)),
      );
  }

  removeConversation(id: string) {
    return this.conversationsSubject.next(
      this.conversationsSubject.value.filter((item) => item.id !== id),
    );
  }

  formatItems(items: ItemListConversationResponse[]): ItemListConversation[] {
    return items.map((item) => {
      return {
        id: item.id.S,
        companionID: item.companionID.S,
      };
    });
  }
}
