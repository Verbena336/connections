import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take, tap } from 'rxjs';
import { GroupDialogService } from 'src/app/group/services/group-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConversationService } from 'src/app/conversation/services/conversation.service';
import { GroupDialogActions } from 'src/app/redux/actions/group-dialog.actions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ConversationActions } from 'src/app/redux/actions/conversation.actions';
import { CreateGroupModalComponent } from '../create-group-modal/create-group-modal.component';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent {
  constructor(
    private dialogRef: MatDialogRef<CreateGroupModalComponent>,
    private groupService: GroupDialogService,
    private snackBar: MatSnackBar,
    private conversationService: ConversationService,
    private store: Store,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { delete: string },
  ) {}

  public isLoading = false;

  delete() {
    this.isLoading = true;
    this.dialogRef.disableClose = true;
    const [point, id] = this.data.delete.split('-');
    if (point === 'group') {
      return this.groupService
        .deleteGroup(id)
        .pipe(
          take(1),
          tap(() => {
            this.store.dispatch(
              GroupDialogActions.deleteGroup({ groupID: id }),
            );
            this.isLoading = false;
            this.dialogRef.disableClose = false;
          }),
        )
        .subscribe({
          next: () => {
            this.snackBar.open('Group was deleted', 'Close');
            this.router.navigate(['/']);
            return this.dialogRef.close();
          },
          error: (error) => {
            this.isLoading = false;
            this.dialogRef.disableClose = false;
            this.snackBar.open(error.message, 'Close');
          },
        });
    }
    return this.conversationService
      .deleteConversation(id)
      .pipe(
        take(1),
        tap(() => {
          this.store.dispatch(
            ConversationActions.deleteConversation({
              conversationID: id,
            }),
          );
          this.isLoading = false;
          this.dialogRef.disableClose = false;
        }),
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Conversation was deleted', 'Close');
          this.router.navigate(['/']);
          return this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading = false;
          this.dialogRef.disableClose = false;
          this.snackBar.open(error.message, 'Close');
        },
      });
  }
}
