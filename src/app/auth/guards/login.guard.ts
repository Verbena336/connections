import { inject } from '@angular/core';
import { map } from 'rxjs';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = () => {
  const loginService = inject(AuthService);
  const router = inject(Router);

  loginService.ckeckUserData();

  return loginService.isLoggedIn$.pipe(
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        return true;
      }
      router.navigate(['/']);
      return false;
    }),
  );
};
