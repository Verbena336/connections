import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProfileResponse } from 'src/app/profile/models/profile.model';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ProfileService } from 'src/app/profile/services/profile.service';
import { UserProfileActions } from '../actions/user-profile.actions';
import { UserData } from '../state.model';

@Injectable()
export class UserProfileEffects {
  getUserProfile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserProfileActions.getUserProfile),
      mergeMap(() =>
        this.profileService.getUserProfile().pipe(
          map((userData: ProfileResponse) => {
            return this.formatProfileResponse(userData);
          }),
          map((res: UserData) =>
            UserProfileActions.getUserProfileSuccess({ userProfile: res }),
          ),
          catchError((error) => {
            return of(UserProfileActions.getUserProfileFail({ error }));
          }),
        ),
      ),
    );
  });

  updateUserName$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserProfileActions.updateUserName),
      mergeMap(({ name }) =>
        this.profileService.updateUserName(name).pipe(
          map(() => UserProfileActions.updateUserNameSuccess({ name })),
          catchError((error) => {
            return of(UserProfileActions.updateUserNameFail({ error }));
          }),
        ),
      ),
    );
  });

  formatProfileResponse(userData: ProfileResponse) {
    const parsedData: UserData = {
      uid: userData.uid.S,
      email: userData.email.S,
      createdAt: userData.createdAt.S,
      name: userData.name.S,
    };
    return parsedData;
  }

  constructor(
    private actions$: Actions,
    private profileService: ProfileService,
  ) {}
}
