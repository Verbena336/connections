import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    this.loadingService.isLoadingSubject.next(true);

    let apiRequest = request.clone({
      url: `${environment.API_URL}${request.url}`,
    });

    const userData = localStorage.getItem('userData');

    if (userData) {
      const { email, uid, token } = JSON.parse(userData);
      if (email && uid && token) {
        apiRequest = apiRequest.clone({
          setHeaders: {
            'rs-uid': uid,
            'rs-email': email,
            Authorization: `Bearer ${token}`,
          },
        });
      }
    }

    return next.handle(apiRequest).pipe(
      finalize(() => this.loadingService.isLoadingSubject.next(false)),
      catchError((error: HttpErrorResponse) => {
        if (
          error.status === 400 ||
          (error.status === 500 && error.error.message)
        ) {
          return throwError(() => error.error);
        }
        if (error.status === 401) {
          return throwError(() => ({
            type: 'InvalidTokenLogout',
            message: error.error.message,
          }));
        }
        return throwError(() => ({
          type: error.statusText,
          message: error.message,
        }));
      }),
    );
  }
}
