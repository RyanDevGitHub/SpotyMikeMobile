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

  return store.select(selectAuthToken).pipe(
    take(1), // on ne prend qu’une seule valeur
    map((token) => {
      if (!token) {
        router.navigate(['/auth/login']);
        return false;
      }
      return true;
    })
  );  
};
