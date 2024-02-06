import { Component, Input, OnDestroy } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Observable, Subscription, take } from 'rxjs';
import { GroupDialogActions } from 'src/app/redux/actions/group-dialog.actions';
import { selectSinceGroup } from 'src/app/redux/selectors/group-dialog.selectors';
import { Since } from 'src/app/redux/state.model';
import { CountdownService } from 'src/app/connections/services/countdown.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-update-chat-button',
  templateUrl: './update-chat-button.component.html',
  styleUrls: ['./update-chat-button.component.scss'],
})
export class UpdateChatButtonComponent implements OnDestroy {
  @Input() id!: string | null;

  public isLoading$ = this.loadingService.isLoading$;

  private since$: Observable<Since> = this.store.select(selectSinceGroup);

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
          this.store.dispatch(
            GroupDialogActions.getGroupMessages({
              groupID: this.id,
              isInit: false,
              since: res[this.id],
            }),
          );
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.messagesSubscription.unsubscribe();
  }
}
