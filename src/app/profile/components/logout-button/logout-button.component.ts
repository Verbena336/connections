import { Component, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConversationService } from 'src/app/conversation/services/conversation.service';
import { GroupDialogService } from 'src/app/group/services/group-dialog.service';
import { PeopleService } from 'src/app/connections/services/people.service';
import { selectIsLoadingProfile } from 'src/app/redux/selectors/user-profile.selectors';
import { UserProfileActions } from 'src/app/redux/actions/user-profile.actions';
import { GroupDialogActions } from 'src/app/redux/actions/group-dialog.actions';
import { ConversationActions } from 'src/app/redux/actions/conversation.actions';

@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.scss'],
})
export class LogoutButtonComponent {
  @Input() isLogout!: boolean;

  @Output() changeIsLogout = new EventEmitter<boolean>();

  public isLoading$: Observable<boolean> = this.store.select(
    selectIsLoadingProfile,
  );

  constructor(
    private zone: NgZone,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private groupService: GroupDialogService,
    private store: Store,
    private peopleService: PeopleService,
    private conversationService: ConversationService,
  ) {}

  handleSignInNavigate() {
    this.zone.run(() => {
      this.router.navigate(['/signin']);
    });
  }

  deleteAppData() {
    this.groupService.refreshGroups();
    this.peopleService.refreshPeoples();
    this.conversationService.refreshConversations();
    this.store.dispatch(UserProfileActions.deleteUserData());
    this.store.dispatch(GroupDialogActions.deleteGroupMessages());
    this.store.dispatch(ConversationActions.deleteConversationsList());

    this.handleSignInNavigate();
  }

  logout() {
    this.changeIsLogout.emit(!this.isLogout);
    this.authService
      .logout()
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.authService.deleteAuthData();
          this.deleteAppData();
          this.snackBar.open('Logout success', 'Close');
        },
        error: (error) => {
          this.changeIsLogout.emit(!this.isLogout);
          this.snackBar.open(error.message, 'Close');
          if (error.type === 'InvalidTokenLogout') {
            this.authService.deleteAuthData();
            this.deleteAppData();
          }
        },
      });
  }
}
