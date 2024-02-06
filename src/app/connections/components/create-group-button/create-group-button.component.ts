import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from 'src/app/core/services/loading.service';
import { CreateGroupModalComponent } from 'src/app/core/components/create-group-modal/create-group-modal.component';
import { GroupDialogService } from 'src/app/group/services/group-dialog.service';

@Component({
  selector: 'app-create-group-button',
  templateUrl: './create-group-button.component.html',
  styleUrls: ['./create-group-button.component.scss'],
})
export class CreateGroupButtonComponent {
  public isLoading$ = this.loadingService.isLoading$;

  constructor(
    public groupService: GroupDialogService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
  ) {}

  openDialog() {
    this.dialog.open(CreateGroupModalComponent, {
      disableClose: false,
    });
  }
}
