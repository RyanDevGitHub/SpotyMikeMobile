import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-strorage.service';
import { IToken } from '../interfaces/user';
import { firstValueFrom, map, take } from 'rxjs';
import { AppState } from '@capacitor/app';
import { Store } from '@ngrx/store';
import { selectAuthToken } from '../store/selector/user.selector';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store<AppState>);

  return (async () => {
    const selectorToken = await firstValueFrom(
      store.select(selectAuthToken).pipe(take(1)),
    );
    if (selectorToken) {
      return true;
    }

    // Fallback: check browser localStorage for an object like { token: "value" }
    const raw = localStorage.getItem('token');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as IToken;
        if (parsed?.token) {
          return true;
        }
      } catch {
        // ignore parse errors
      }
    }

    await router.navigate(['/auth/login']);
    return false;
  })();
};
