import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/core/components/confirm-modal/confirm-modal.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ItemGroup } from 'src/app/group/models/group-dialog.model';
import { GroupDialogService } from 'src/app/group/services/group-dialog.service';
import { CountdownService } from '../../services/countdown.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
})
export class GroupListComponent {
  @Input() groups!: ItemGroup[] | null;

  constructor(
    public groupService: GroupDialogService,
    public countdownService: CountdownService,
    private dialog: MatDialog,
    public authService: AuthService,
  ) {}

  deleteGroup(event: Event, group: string) {
    event.stopPropagation();
    this.dialog.open(ConfirmModalComponent, {
      data: {
        delete: `group-${group}`,
      },
      disableClose: false,
    });
  }
}
