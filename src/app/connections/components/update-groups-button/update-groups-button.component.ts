import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnDestroy } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Subscription, take } from 'rxjs';
import { GroupDialogService } from 'src/app/group/services/group-dialog.service';
import { CountdownService } from '../../services/countdown.service';

@Component({
  selector: 'app-update-groups-button',
  templateUrl: './update-groups-button.component.html',
  styleUrls: ['./update-groups-button.component.scss'],
})
export class UpdateGroupsButtonComponent implements OnDestroy {
  public isLoading$ = this.loadingService.isLoading$;

  constructor(
    public countdownService: CountdownService,
    public groupService: GroupDialogService,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService,
  ) {}

  groupsSubscription = new Subscription();

  public isDisable = false;

  getGroups() {
    this.isDisable = true;
    this.groupsSubscription = this.groupService
      .getGroups()
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.isDisable = false;
        },
        error: (error) => {
          this.isDisable = false;
          this.snackBar.open(error.message, 'Close');
        },
      });
  }

  ngOnDestroy(): void {
    this.groupsSubscription.unsubscribe();
  }
}
