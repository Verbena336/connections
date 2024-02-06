import { AuthService } from 'src/app/auth/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, NgZone } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { ConversationService } from 'src/app/conversation/services/conversation.service';
import { PeopleService } from '../../services/people.service';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss'],
})
export class PeopleListComponent {
  public isLoading$ = this.loadingService.isLoading$;

  public people$ = this.peopleService.people$;

  constructor(
    public authService: AuthService,
    private conversationService: ConversationService,
    private snackBar: MatSnackBar,
    private router: Router,
    private zone: NgZone,
    private peopleService: PeopleService,
    private loadingService: LoadingService,
  ) {}

  public isDisable = false;

  isCreatedConversation(uid: string): boolean {
    return !!this.conversationService.isCreatedConversation(uid);
  }

  handleConversation(uid: string) {
    if (this.isDisable) return;
    this.isDisable = true;
    const createdConversation =
      this.conversationService.isCreatedConversation(uid);
    if (!createdConversation) {
      this.conversationService
        .createConversation(uid)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.isDisable = false;
            this.conversationService.addConversation(res.conversationID, uid);
            this.zone.run(() => {
              this.router.navigate([`/conversation/${res.conversationID}`]);
            });
          },
          error: (error) => {
            this.isDisable = false;
            this.snackBar.open(error.message, 'Close');
          },
        });
    } else if (createdConversation) {
      this.zone.run(() => {
        this.router.navigate([`/conversation/${createdConversation.id}`]);
      });
    }
  }
}
