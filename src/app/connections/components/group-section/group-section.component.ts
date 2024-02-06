import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Subscription, switchMap, take } from 'rxjs';
import { GroupDialogService } from 'src/app/group/services/group-dialog.service';
import { CountdownService } from '../../services/countdown.service';

@Component({
  selector: 'app-group-section',
  templateUrl: './group-section.component.html',
  styleUrls: ['./group-section.component.scss'],
})
export class GroupSectionComponent implements OnInit, OnDestroy {
  constructor(
    public groupService: GroupDialogService,
    public countdownService: CountdownService,
    public authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  private groupsSubscription = new Subscription();

  public groups$ = this.groupService.groups$;

  ngOnInit() {
    this.groupsSubscription = this.groupService.groupsLoaded$
      .pipe(
        take(1),
        switchMap((groups) => {
          if (!groups) {
            return this.groupService.getGroups(true);
          }
          return EMPTY;
        }),
      )
      .subscribe({
        error: (error) => this.snackBar.open(error.message, 'Close'),
      });
  }

  ngOnDestroy(): void {
    this.groupsSubscription.unsubscribe();
  }
}
