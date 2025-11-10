import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

import { IUser, IUserDataBase } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { AuthentificationService } from '../../services/authentification.service';
import { AuthFacade } from '../../state/auth/auth.facade';
import {
  addLastSongUser,
  addLastSongUserSuccess,
  initializeAuth,
  loadUser,
  loadUserFailure,
  loadUserSuccess,
  login,
  loginFailure,
  loginSuccess,
  logout,
  logoutFailure,
  logoutSuccess,
  updateUser,
  updateUserFailure,
  updateUserSuccess,
} from '../action/user.action';
import { UserRepositoryService } from './../../services/repositories/user-repository.service';
import {
  addSongToPlaylist,
  addSongToPlaylistFailure,
  addSongToPlaylistSuccess,
  createPlaylist,
  createPlaylistFailure,
  createPlaylistSuccess,
  removeSongFromPlaylist,
  removeSongFromPlaylistFailure,
  removeSongFromPlaylistSuccess,
} from './../action/user.action';

@Injectable()
export class UserEffects {
  private authService = inject(AuthentificationService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private user$ = this.authFacade.user$;
  constructor(
    private actions$: Actions,
    private localStorageService: LocalStorageService,
    private userRepositoryService: UserRepositoryService,
    private authFacade: AuthFacade
  ) {}

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUser),
      switchMap(() => {
        const idUser = this.localStorageService.getItem<string>('idUser');

        if (idUser) {
          console.log('[Effect] Local user found:', idUser);

          // Appel réseau async via from()
          return from(this.userRepositoryService.getUserById(idUser)).pipe(
            map((updatedUser) => {
              console.log('[Effect] Updated user from DB:', updatedUser);
              return loadUserSuccess({ user: updatedUser });
            }),
            catchError((error) => {
              console.error('[Effect] Error fetching user from DB:', error);
              return of(
                loadUserFailure({
                  error: error.message || 'Unknown error',
                })
              );
            })
          );
        } else {
          console.log('[Effect] No local user found');
          return of(
            loadUserFailure({ error: 'No user found in local storage' })
          );
        }
      })
    )
  );

  addLastSongUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addLastSongUser), // écoute l'action
      withLatestFrom(this.authFacade.user$), // récupère le user courant depuis le store
      switchMap(([{ songId }, user]) => {
        if (!user) {
          console.log('[Effect] No user found in store');
          return of(loadUserFailure({ error: 'No user found in store' }));
        }

        console.log('[Effect] User found in store:', user.email);

        return from(
          this.userRepositoryService.addToLastPlayed(user.id, songId)
        ).pipe(
          map((updatedUser) => {
            console.log('[Effect] LastSongPlayed updated in DB:', updatedUser);
            return addLastSongUserSuccess({ updatedUser });
          }),
          catchError((error) => {
            console.error(
              '[Effect] Error updating LastSongPlayed in DB:',
              error
            );
            // fallback -> on garde l'user actuel
            return of(addLastSongUserSuccess({ updatedUser: user }));
          })
        );
      })
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      switchMap(({ userId, changes }) => {
        console.log('[Effect] updateUser action received:', {
          userId,
          changes,
        });

        // 1️⃣ Mettre à jour le user dans Firestore
        return from(
          this.userRepositoryService.updateUser(userId, changes)
        ).pipe(
          // 2️⃣ Après update, récupérer le user complet
          switchMap(() => from(this.userRepositoryService.getUserById(userId))),
          // 3️⃣ Envoyer success avec le user complet
          map((fullUserDb) => {
            console.log(
              '[Effect] User updated successfully in DB:',
              fullUserDb
            );
            const fullUser: IUser = {
              id: fullUserDb.id!,
              firstName: fullUserDb.firstName ?? '',
              lastName: fullUserDb.lastName ?? '',
              email: fullUserDb.email ?? '',
              sexe: fullUserDb.sexe ?? '2',
              tel: fullUserDb.tel ?? '',
              playlists: fullUserDb.playlists ?? [],
              created_at: fullUserDb.created_at ?? '',
              avatar: fullUserDb.avatar ?? '',
              role: fullUserDb.role!, // obligatoire, doit exister
              favorites: fullUserDb.favorites ?? [],
              password: fullUserDb.password ?? '',
              lastsPlayed: fullUserDb.lastsPlayed ?? [],
            };
            return updateUserSuccess({ updatedUser: fullUser });
          }),
          // 4️⃣ Gestion d’erreur
          catchError((error) => {
            console.error('[Effect] Error updating user:', error);
            return of(
              updateUserFailure({ error: error.message || 'Unknown error' })
            );
          })
        );
      })
    )
  );

  // ---- LOGIN ----
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((result) => {
            if (result.type === 'error') {
              return loginFailure({ error: result.message });
            } else {
              console.log(result);
              this.localStorageService.setItem('token', result.token);
              this.localStorageService.setItem('idUser', result.user.id);
              return loginSuccess({ user: result.user, token: result.token });
            }
          }),

          catchError((error) => of(loginFailure({ error: error.message })))
        )
      )
    )
  );

  // Redirection après succès du login
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(({ token, user }) => {
          if (token) {
            this.localStorageService.setItem('token', token);
          }
          if (user?.id) {
            this.localStorageService.setItem('idUser', user.id);
          }
          this.router.navigate(['/home/home']);
        })
      ),
    { dispatch: false }
  );

  rehydrateAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(initializeAuth),
      // 1. Appel à la nouvelle méthode qui écoute l'état de l'utilisateur
      switchMap(() => this.auth.authState$), // authState$ est votre Observable basé sur onAuthStateChanged

      // 2. Filtrer l'utilisateur (s'il est null, il n'y a pas de session à réhydrater)
      filter((firebaseUser) => {
        if (!firebaseUser) {
          console.log('[Effect] No active session restored by Firebase.');
          // Si pas de session, l'effect se termine sans erreur ni action
          return false;
        }
        return true;
      }),

      // 3. L'utilisateur Firebase est restauré, on peut récupérer ses données Firestore
      switchMap((firebaseUser) => {
        const uid = firebaseUser!.uid;
        console.log(
          '[Effect] Session restored. Fetching Firestore user data for uid:',
          uid
        );

        // On récupère les données Firestore comme avant
        return this.auth.getUserData(uid).pipe(
          tap((userDataBase) =>
            console.log(
              '[Effect] User data fetched from Firestore:',
              userDataBase
            )
          ),
          // Le loginSuccess est déclenché car l'utilisateur est maintenant authentifié et a ses données
          map((userDataBase: IUserDataBase) =>
            loginSuccess({
              user: userDataBase,
              // NOTE : Le token n'est plus nécessaire ici pour l'état de la session
              // Si vous en avez besoin pour le store, utilisez firebaseUser.getIdToken()
              // Pour l'instant, on peut le laisser à null ou l'omettre si votre store le permet.
              token: { token: 'RESTORED' },
            })
          )
        );
      }),

      // 4. Gestion des erreurs (Échec de la lecture Firestore, etc.)
      catchError((error) => {
        console.error('[Effect] Rehydration failed (Firestore error?):', error);
        // Nettoyage et redirection si la réhydratation échoue
        this.localStorageService.removeItem('token');
        this.localStorageService.removeItem('idUser');
        this.router.navigate(['/auth/login']);
        return of(
          loginFailure({ error: 'Session non valide ou données manquantes.' })
        );
      })
    )
  );
  // ---- LOGOUT ----
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      switchMap(() =>
        from(this.authService.logout()).pipe(
          // à ajouter dans AuthentificationService
          tap(() => {
            this.localStorageService.removeItem('token');
            this.localStorageService.removeItem('idUser');
            this.localStorageService.removeItem('mesFavoris');
            this.router.navigate(['/auth/login']);
          }),
          map(() => logoutSuccess()),
          catchError((error) => of(logoutFailure({ error: error.message })))
        )
      )
    )
  );

  createPlaylist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createPlaylist),
      tap((action) => console.log('🎯 Effect déclenché avec:', action)),
      switchMap(({ title, song }) => {
        // Lecture synchrone du userId
        const userId = this.localStorageService.getItem<string>('idUser');

        if (!userId) {
          console.error('❌ Aucun utilisateur connecté');
          return of(
            createPlaylistFailure({ error: 'Utilisateur non connecté' })
          );
        }

        console.log(
          '📦 Appel createPlaylist dans le repo avec userId:',
          userId,
          'title:',
          title,
          'songId:',
          song.id
        );

        // Appel réseau async via from()
        return from(
          this.userRepositoryService.createPlaylist(userId, title, {
            idSong: song.id,
          })
        ).pipe(
          tap((playlist) =>
            console.log('🎵 Playlist reçue du repo:', playlist)
          ),
          map((playlist) => createPlaylistSuccess({ playlist })),
          catchError((error) =>
            of(createPlaylistFailure({ error: error.message }))
          )
        );
      })
    )
  );

  addSongToPlaylist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addSongToPlaylist),
      tap(() => {
        console.log('[Effect] addSongToPlaylist triggered');
      }),
      switchMap(({ playlistId, song }) => {
        console.log('[Effect] Entered addSongToPlaylist effect', {
          playlistId,
          song,
        });

        const userId = this.localStorageService.getItem<string>('idUser');

        if (typeof userId !== 'string' || !userId) {
          console.error('[Effect] Utilisateur non connecté');
          return of(
            addSongToPlaylistFailure({ error: 'Utilisateur non connecté' })
          );
        }

        console.log('[Effect] idUser reçu:', userId);

        return from(
          this.userRepositoryService.addSongToPlaylist(userId, playlistId, {
            idSong: song.id,
          })
        ).pipe(
          map((updatedPlaylist) =>
            addSongToPlaylistSuccess({ playlist: updatedPlaylist })
          ),
          catchError((error) =>
            of(addSongToPlaylistFailure({ error: error.message }))
          )
        );
      })
    )
  );

  removeSongFromPlaylist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeSongFromPlaylist),
      tap(() => {
        console.log('[Effect] removeSongFromPlaylist triggered');
      }),
      switchMap(({ playlistId, songId }) => {
        console.log('[Effect] Entered removeSongFromPlaylist effect', {
          playlistId,
          songId,
        });

        const userId = this.localStorageService.getItem<string>('idUser');

        if (typeof userId !== 'string' || !userId) {
          console.error('[Effect] Utilisateur non connecté');
          return of(
            removeSongFromPlaylistFailure({ error: 'Utilisateur non connecté' })
          );
        }

        console.log('[Effect] idUser reçu:', userId);

        return from(
          this.userRepositoryService.removeSongFromPlaylist(
            userId,
            playlistId,
            songId
          )
        ).pipe(
          map((updatedPlaylist) =>
            removeSongFromPlaylistSuccess({ playlistId, updatedPlaylist })
          ),
          catchError((error) =>
            of(removeSongFromPlaylistFailure({ error: error.message }))
          )
        );
      })
    )
  );
}
