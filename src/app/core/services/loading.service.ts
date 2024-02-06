import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  public isLoadingSubject = new BehaviorSubject(false);

  public isLoading$ = this.isLoadingSubject.asObservable();
}
