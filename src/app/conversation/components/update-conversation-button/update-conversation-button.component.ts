import { Component, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, take } from 'rxjs';
import { CountdownService } from 'src/app/connections/services/countdown.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ConversationActions } from 'src/app/redux/actions/conversation.actions';
import {
  selectConversationsMessagesData,
  selectSinceConversation,
} from 'src/app/redux/selectors/conversation.selectors';
import { MessagesData, Since } from 'src/app/redux/state.model';

@Component({
  selector: 'app-update-conversation-button',
  templateUrl: './update-conversation-button.component.html',
  styleUrls: ['./update-conversation-button.component.scss'],
})
export class UpdateConversationButtonComponent implements OnDestroy {
  @Input() id!: string | null;

  public isLoading$ = this.loadingService.isLoading$;

  public conversationMessages$: Observable<MessagesData> = this.store.select(
    selectConversationsMessagesData,
  );

  public since$: Observable<Since> = this.store.select(selectSinceConversation);

  constructor(
    private loadingService: LoadingService,
    private store: Store,
    public countdownService: CountdownService,
  ) {}

  messagesSubscription = new Subscription();

  getMessages() {
    if (this.id && !this.countdownService.timers.has(this.id)) {
      this.since$.pipe(take(1)).subscribe((res) => {
        if (this.id) {
          if (res[this.id]) {
            this.store.dispatch(
              ConversationActions.getConversationMessages({
                conversationID: this.id,
                isInit: false,
                since: res[this.id],
              }),
            );
          } else {
            this.store.dispatch(
              ConversationActions.getConversationMessages({
                conversationID: this.id,
                isInit: false,
              }),
            );
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.messagesSubscription.unsubscribe();
  }
}
