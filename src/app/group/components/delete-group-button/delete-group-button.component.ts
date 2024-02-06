import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmModalComponent } from 'src/app/core/components/confirm-modal/confirm-modal.component';
import { GroupDialogService } from '../../services/group-dialog.service';

@Component({
  selector: 'app-delete-group-button',
  templateUrl: './delete-group-button.component.html',
  styleUrls: ['./delete-group-button.component.scss'],
})
export class DeleteGroupButtonComponent {
  private id: string | null;

  constructor(
    public groupService: GroupDialogService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  deleteGroup() {
    this.dialog.open(ConfirmModalComponent, {
      data: {
        delete: `group-${this.id}`,
      },
      disableClose: false,
    });
  }
}
