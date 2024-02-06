import { Component, NgZone } from '@angular/core';
import { ConfirmModalComponent } from 'src/app/core/components/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { ConversationService } from '../../services/conversation.service';

@Component({
  selector: 'app-delete-conversation-button',
  templateUrl: './delete-conversation-button.component.html',
  styleUrls: ['./delete-conversation-button.component.scss'],
})
export class DeleteConversationButtonComponent {
  private id: string | null;

  constructor(
    private conversationService: ConversationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private zone: NgZone,
    private store: Store,
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  deleteGroup() {
    this.dialog.open(ConfirmModalComponent, {
      data: {
        delete: `conversation-${this.id}`,
      },
      disableClose: false,
    });
  }
}
