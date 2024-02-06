import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Subscription, catchError, switchMap, take, throwError } from 'rxjs';
import { ConversationService } from 'src/app/conversation/services/conversation.service';
import { IError } from 'src/app/redux/state.model';
import { PeopleService } from '../../services/people.service';
import { CountdownService } from '../../services/countdown.service';
import { ItemPeople } from '../../models/people.model';

@Component({
  selector: 'app-update-people-button',
  templateUrl: './update-people-button.component.html',
  styleUrls: ['./update-people-button.component.scss'],
})
export class UpdatePeopleButtonComponent implements OnDestroy {
  public isLoading$ = this.loadingService.isLoading$;

  public isDisable = false;

  constructor(
    public countdownService: CountdownService,
    public peopleService: PeopleService,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService,
    private conversationService: ConversationService,
  ) {}

  subscription = new Subscription();

  conversationSubscription = new Subscription();

  public people: ItemPeople[] = [];

  getPeople() {
    this.peopleService
      .getPeople()
      .pipe(
        take(1),
        switchMap(() => {
          return this.conversationService.getConversations();
        }),
        catchError((error: IError) => throwError(() => error)),
      )
      .subscribe({
        error: (error) => {
          this.snackBar.open(error.message, 'Close');
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
