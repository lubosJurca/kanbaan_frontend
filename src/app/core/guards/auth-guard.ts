import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn,Router } from '@angular/router';
import { AuthStore } from '../../features/auth/auth.store';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  
  return toObservable(authStore.isInitialized).pipe(
    filter(isInitialized => isInitialized === true),
    take(1),
    map(() => {
      if(authStore.isLoggedIn()){
        return true;
      }

      return router.createUrlTree(['/login']);
    })
  );
};
