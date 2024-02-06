import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { ProfileResponse } from '../models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private http: HttpClient,
    private store: Store,
  ) {}

  getUserProfile() {
    return this.http.get<ProfileResponse>(environment.PROFILE);
  }

  updateUserName(name: string) {
    return this.http.put(environment.PROFILE, { name });
  }
}
