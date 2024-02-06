import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ItemPeople,
  ItemPeopleResponse,
  PeopleResponse,
} from '../models/people.model';
import { CountdownService } from './countdown.service';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  constructor(
    private http: HttpClient,
    private countdownService: CountdownService,
  ) {}

  private peopleSubject = new BehaviorSubject<ItemPeople[]>([]);

  public people$ = this.peopleSubject.asObservable();

  private peopleLoadedSubject = new BehaviorSubject<boolean>(false);

  public peopleLoaded$ = this.peopleLoadedSubject.asObservable();

  refreshPeoples() {
    this.peopleSubject.next([]);
    this.peopleLoadedSubject.next(false);
  }

  getPeople(isInit?: boolean) {
    return this.http.get<PeopleResponse>(environment.USERS).pipe(
      map((people) => this.formatItems(people.Items)),
      tap(() => {
        this.peopleLoadedSubject.next(true);
      }),
      tap((people) => {
        if (!isInit) {
          this.countdownService.startTimer('people');
        }
        this.peopleSubject.next(people);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  getPersonName(id: string) {
    const person = this.peopleSubject.value.find((elem) => elem.uid === id);
    if (person) {
      return person.name;
    }
    return '';
  }

  formatItems(items: ItemPeopleResponse[]): ItemPeople[] {
    return items.map((item) => {
      return {
        uid: item.uid.S,
        name: item.name.S,
      };
    });
  }
}
