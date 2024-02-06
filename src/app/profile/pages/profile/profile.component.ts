import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable, Subject, skip, take, takeUntil } from 'rxjs';
import { MyErrorStateMatcher } from 'src/app/auth/helpers/ErrorStateMatcher';
import { UserProfileActions } from 'src/app/redux/actions/user-profile.actions';
import {
  selectIsError,
  selectIsLoadingProfile,
  selectUserData,
} from 'src/app/redux/selectors/user-profile.selectors';
import { IError, UserData } from 'src/app/redux/state.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroySubject$ = new Subject<void>();

  public UserData$: Observable<UserData> = this.store.select(selectUserData);

  public isLoading$: Observable<boolean> = this.store.select(
    selectIsLoadingProfile,
  );

  public isError$: Observable<IError | null> = this.store.select(selectIsError);

  form = this.formBuilder.group({
    name: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[\p{L} ]+$/u),
        Validators.maxLength(40),
      ],
    ],
  });

  constructor(
    private store: Store,
    private snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
  ) {}

  isLogout = false;

  handleLogout(isLogout: boolean) {
    this.isLogout = isLogout;
  }

  matcher = new MyErrorStateMatcher();

  isEditing = false;

  ngOnInit(): void {
    this.UserData$.pipe(take(1)).subscribe(
      ({ createdAt, name, uid, email }) => {
        if (!createdAt || !email || !uid || !name) {
          this.store.dispatch(UserProfileActions.getUserProfile());
        }
      },
    );

    this.UserData$.pipe(takeUntil(this.destroySubject$)).subscribe(
      ({ name }) => {
        this.form.setValue({ name: name || '' });
      },
    );

    this.isError$.pipe(takeUntil(this.destroySubject$)).subscribe((res) => {
      if (res) {
        this.snackBar.open(res.message, 'Close');
      }
    });
  }

  get name() {
    return this.form.get('name');
  }

  handleEdit() {
    this.isEditing = true;
  }

  handleCancel() {
    this.UserData$.pipe(take(1)).subscribe((res) =>
      this.form.setValue({ name: res?.name || '' }),
    );
    this.isEditing = false;
  }

  handleSave() {
    if (this.form.value.name) {
      this.store.dispatch(
        UserProfileActions.updateUserName({ name: this.form.value.name }),
      );

      this.UserData$.pipe(skip(1), take(1)).subscribe(() => {
        this.isEditing = false;
        this.snackBar.open('Profile was updated', 'Close');
      });
    }
  }

  ngOnDestroy(): void {
    this.destroySubject$.next();
    this.destroySubject$.complete();
  }
}
