import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Signup } from '../models/signup.model';
import { Signin } from '../models/signin.model';
import { UserData } from '../models/userData.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private uidSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  public uid$ = this.uidSubject.asObservable();

  constructor(
    private http: HttpClient,
    private zone: NgZone,
    private router: Router,
  ) {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.isLoggedInSubject.next(true);
      this.uidSubject.next(JSON.parse(userData).uid || null);
    }
  }

  ckeckUserData() {
    if (!localStorage.getItem('userData')) {
      this.isLoggedInSubject.next(false);
    }
  }

  registration(data: Signup) {
    return this.http.post(environment.SIGNUP, data);
  }

  login(data: Signin) {
    return this.http.post(environment.SIGNIN, data);
  }

  logout() {
    return this.http.delete(environment.LOGOUT);
  }

  saveData(data: UserData) {
    localStorage.setItem('userData', JSON.stringify(data));
    this.isLoggedInSubject.next(true);
    this.uidSubject.next(data.uid);
    this.zone.run(() => {
      this.router.navigate(['/']);
    });
  }

  deleteAuthData() {
    localStorage.removeItem('userData');
    this.isLoggedInSubject.next(false);
    this.uidSubject.next(null);
  }
}
