import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CountdownService } from 'src/app/connections/services/countdown.service';
import {
  BehaviorSubject,
  take,
  map,
  catchError,
  throwError,
  tap,
  switchMap,
  of,
  EMPTY,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { GroupDialogActions } from 'src/app/redux/actions/group-dialog.actions';
import {
  CreateGroupResponse,
  GroupDialogResponse,
  GroupResponse,
  ItemGroup,
  ItemGroupResponse,
} from '../models/group-dialog.model';

@Injectable({
  providedIn: 'root',
})
export class GroupDialogService {
  private groupsSubject = new BehaviorSubject<ItemGroup[]>([]);

  public groups$ = this.groupsSubject.asObservable();

  private groupsLoadedSubject = new BehaviorSubject<boolean>(false);

  public groupsLoaded$ = this.groupsLoadedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private countdownService: CountdownService,
    private store: Store,
  ) {}

  getMessages(id: string, since?: string) {
    let params = new HttpParams().append('groupID', id);
    if (since) {
      params = params.append('since', since);
    }
    return this.http.get<GroupDialogResponse>(environment.GROUP_MESSAGES, {
      params,
    });
  }

  addMessage(groupID: string, message: string) {
    return this.http.post(environment.ADD_GROUP_MESSAGE, {
      groupID,
      message,
    });
  }

  refreshGroups() {
    this.groupsSubject.next([]);
    this.groupsLoadedSubject.next(false);
  }

  isMyGroup(id: string | null) {
    return this.authService.uid$.pipe(
      take(1),
      map((uid) => {
        const currGroup = this.groupsSubject.value.find(
          (group) => group.id === id,
        );
        return currGroup?.createdBy === uid;
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  getGroups(isInit?: boolean) {
    return this.http.get<GroupResponse>(environment.GROUPS_LIST).pipe(
      map((groups) => this.formatItems(groups.Items)),
      tap((groups) => {
        this.groupsLoadedSubject.next(true);
        if (!isInit) {
          this.countdownService.startTimer('groups');
        }
        this.groupsSubject.next(groups);
        const idArray = groups.map((obj) => obj.id);
        this.store.dispatch(
          GroupDialogActions.updateGroups({
            groupsIDs: idArray,
          }),
        );
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  createGroup(name: string) {
    return this.authService.uid$.pipe(
      take(1),
      switchMap((uid) =>
        this.http
          .post<CreateGroupResponse>(environment.GROUPS_CREATE, { name })
          .pipe(
            switchMap((group) => {
              if (uid) {
                return of({
                  id: group.groupID,
                  name,
                  createdBy: uid,
                  createdAt: String(new Date().getTime()),
                });
              }
              return EMPTY;
            }),
            tap((group) => {
              this.groupsSubject.next([...this.groupsSubject.value, group]);
            }),
            catchError((error) => throwError(() => error)),
          ),
      ),
    );
  }

  deleteGroup(id: string) {
    const params = new HttpParams().append('groupID', id);
    return this.http.delete(environment.GROUPS_DELETE, { params }).pipe(
      take(1),
      tap(() => {
        this.groupsSubject.next([
          ...this.groupsSubject.value.filter((group) => group.id !== id),
        ]);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  formatItems(items: ItemGroupResponse[]): ItemGroup[] {
    return items.map((item) => {
      return {
        id: item.id.S,
        name: item.name.S,
        createdAt: item.createdAt.S,
        createdBy: item.createdBy.S,
      };
    });
  }
}
