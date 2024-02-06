import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY, Observable, Subject, switchMap, take, takeUntil } from 'rxjs';
import { PeopleService } from 'src/app/connections/services/people.service';
import { ConversationActions } from 'src/app/redux/actions/conversation.actions';
import {
  selectConversationsMessagesData,
  selectIsErrorMessages,
  selectIsLoadingMessages,
  selectSinceConversation,
} from 'src/app/redux/selectors/conversation.selectors';
import { IError, MessagesData, Since } from 'src/app/redux/state.model';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent implements OnInit, OnDestroy {
  private destroySubject$ = new Subject<void>();

  public conversationMessages$: Observable<MessagesData> = this.store.select(
    selectConversationsMessagesData,
  );

  public isLoading$: Observable<boolean> = this.store.select(
    selectIsLoadingMessages,
  );

  public isError$: Observable<IError | null> = this.store.select(
    selectIsErrorMessages,
  );

  public since$: Observable<Since> = this.store.select(selectSinceConversation);

  public id!: string | null;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public peopleService: PeopleService,
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.peopleService.peopleLoaded$
      .pipe(
        take(1),
        switchMap((people) => {
          if (!people) {
            return this.peopleService.getPeople(true);
          }
          return EMPTY;
        }),
      )
      .subscribe({
        error: (error) => this.snackBar.open(error.message, 'Close'),
      });

    this.since$.pipe(take(1)).subscribe((res) => {
      if (this.id) {
        if (res[this.id]) {
          this.store.dispatch(
            ConversationActions.getConversationMessages({
              conversationID: this.id,
              isInit: true,
              since: res[this.id],
            }),
          );
        } else {
          this.store.dispatch(
            ConversationActions.getConversationMessages({
              conversationID: this.id,
              isInit: true,
            }),
          );
        }
      }
    });

    this.isError$.pipe(takeUntil(this.destroySubject$)).subscribe((res) => {
      if (res) {
        this.snackBar.open(res.message, 'Close');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroySubject$.next();
    this.destroySubject$.complete();
  }
}
