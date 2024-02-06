import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EMPTY, Subscription, switchMap, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConversationService } from 'src/app/conversation/services/conversation.service';
import { CountdownService } from '../../services/countdown.service';
import { PeopleService } from '../../services/people.service';

@Component({
  selector: 'app-people-section',
  templateUrl: './people-section.component.html',
  styleUrls: ['./people-section.component.scss'],
})
export class PeopleSectionComponent implements OnInit, OnDestroy {
  constructor(
    public countdownService: CountdownService,
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private peopleService: PeopleService,
    private conversationService: ConversationService,
  ) {}

  private peopleSubscription = new Subscription();

  private conversationSubscription = new Subscription();

  ngOnInit() {
    this.peopleSubscription = this.peopleService.peopleLoaded$
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
        error: (error) => {
          this.snackBar.open(error.message, 'Close');
        },
      });

    this.conversationSubscription =
      this.conversationService.conversationListLoaded$
        .pipe(
          take(1),
          switchMap((conv) => {
            if (!conv) {
              return this.conversationService.getConversations();
            }
            return EMPTY;
          }),
        )
        .subscribe({
          error: (error) => {
            this.snackBar.open(error.message, 'Close');
          },
        });
  }

  ngOnDestroy(): void {
    this.conversationSubscription.unsubscribe();
    this.peopleSubscription.unsubscribe();
  }
}
