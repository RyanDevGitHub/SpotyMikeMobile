// core/state/auth/auth.facade.ts
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IUser } from '../../interfaces/user';
import * as UserActions from '../../store/action/user.action';
import * as UserSelectors from '../../store/selector/user.selector';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  user$: Observable<IUser | null> = this.store.select(UserSelectors.selectUser);
  isLoading$: Observable<boolean> = this.store.select(
    UserSelectors.selectLoading,
  );

  constructor(private store: Store) {}

  loadUser() {
    this.store.dispatch(UserActions.loadUser());
  }

  login(email: string, password: string) {
    this.store.dispatch(UserActions.login({ email, password }));
  }

  logout() {
    this.store.dispatch(UserActions.logout());
  }
}
