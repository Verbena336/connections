import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  EMPTY,
  Observable,
  Subject,
  Subscription,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { PeopleService } from 'src/app/connections/services/people.service';
import { GroupDialogActions } from 'src/app/redux/actions/group-dialog.actions';
import {
  selectIsErrorMessages,
  selectIsLoadingMessages,
  selectSinceGroup,
} from 'src/app/redux/selectors/group-dialog.selectors';
import { IError, Since } from 'src/app/redux/state.model';
import { GroupDialogService } from '../../services/group-dialog.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit, OnDestroy {
  private destroySubject$ = new Subject<void>();

  private since$: Observable<Since> = this.store.select(selectSinceGroup);

  public isLoading$: Observable<boolean> = this.store.select(
    selectIsLoadingMessages,
  );

  public isError$: Observable<IError | null> = this.store.select(
    selectIsErrorMessages,
  );

  public id!: string | null;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public groupService: GroupDialogService,
    public peopleService: PeopleService,
  ) {}

  private groupsSubscription = new Subscription();

  private peopleSubscription = new Subscription();

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    // Запрос, если юзер заходит на страницу группы не с главной
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
        error: (error) => {
          this.snackBar.open(error.message, 'Close');
        },
      });

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

    this.since$.pipe(take(1)).subscribe((res) => {
      if (this.id) {
        this.store.dispatch(
          GroupDialogActions.getGroupMessages({
            groupID: this.id,
            isInit: true,
            since: res[this.id],
          }),
        );
      }
    });

    this.isError$.pipe(takeUntil(this.destroySubject$)).subscribe((res) => {
      if (res) {
        this.snackBar.open(res.message, 'Close');
      }
    });
  }

  ngOnDestroy(): void {
    this.peopleSubscription.unsubscribe();
    this.groupsSubscription.unsubscribe();
    this.destroySubject$.next();
    this.destroySubject$.complete();
  }
}
