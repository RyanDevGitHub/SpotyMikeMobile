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
import { UserRepositoryService } from './../../services/repositories/user-repository.service';
import { LocalStorageService } from 'src/app/core/services/local-strorage.service';
import { effect, inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { firstValueFrom, from, of } from 'rxjs';
import {
  catchError,
  defaultIfEmpty,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  addLastSongUser,
  addLastSongUserSuccess,
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
import { IToken, IUser } from '../../interfaces/user';
import { AuthentificationService } from '../../services/authentification.service';
import { Router } from '@angular/router';
import { LoginRequestError } from '../../interfaces/login';
import { AuthFacade } from '../../state/auth/auth.facade';

@Injectable()
export class UserEffects {
  private authService = inject(AuthentificationService);
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
      switchMap(() =>
        this.localStorageService.getItem<string>('idUser').pipe(
          switchMap((idUser) => {
            if (idUser) {
              console.log('[Effect] Local user found:', idUser);
              // Appeler la BDD pour obtenir les données mises à jour
              return from(this.userRepositoryService.getUserById(idUser)).pipe(
                // Conversion Promise -> Observable
                map((updatedUser) => {
                  console.log('[Effect] Updated user from DB:', updatedUser);
                  return loadUserSuccess({ user: updatedUser }); // Mise à jour avec les données de la BDD
                }),
                catchError((error) => {
                  console.error('[Effect] Error fetching user from DB:', error);
                  console.log('[Effect] Falling back to local user:', idUser);
                  // Fallback : utiliser l'utilisateur local
                  return of(
                    loadUserFailure({ error: error.message || 'Unknown error' })
                  );
                })
              );
            } else {
              console.log('[Effect] No local user found');
              return of(
                loadUserFailure({ error: 'No user found in local storage' })
              );
            }
          }),
          catchError((error) =>
            of(loadUserFailure({ error: error.message || 'Unknown error' }))
          )
        )
      )
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
              lastsplayeds: fullUserDb.lastsplayeds ?? [],
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
        tap(() => {
          this.router.navigate(['/home/home']);
        })
      ),
    { dispatch: false }
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
      switchMap(({ title, song }) =>
        from(firstValueFrom(this.localStorageService.getItem('idUser'))).pipe(
          tap((user) => console.log('👤 ID user récupéré:', user)),
          switchMap((user: any) => {
            if (!user) {
              console.error('❌ Aucun utilisateur connecté');
              throw new Error('Utilisateur non connecté');
            }

            const userId = user;

            console.log(
              '📦 Appel createPlaylist dans le repo avec userId:',
              userId,
              'title:',
              title,
              'songId:',
              song.id
            );
            return from(
              this.userRepositoryService.createPlaylist(userId, title, {
                idSong: song.id,
              })
            );
          }),
          tap((playlist) =>
            console.log('🎵 Playlist reçue du repo:', playlist)
          ),
          map((playlist) => createPlaylistSuccess({ playlist })),
          catchError((error) => {
            console.error(
              '❌ Erreur dans createPlaylist Effect:',
              error.message
            );
            return of(createPlaylistFailure({ error: error.message }));
          })
        )
      )
    )
  );

  addSongToPlaylist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addSongToPlaylist), // ton action à déclencher
      tap(() => {
        console.log('[Effect] addSongToPlaylist triggered');
      }),
      switchMap(({ playlistId, song }) => {
        console.log('[Effect] Entered addSongToPlaylist effect', {
          playlistId,
          song,
        });
        return from(this.localStorageService.getItem('idUser')).pipe(
          switchMap((userId) => {
            if (typeof userId !== 'string' || !userId) {
              throw new Error('Utilisateur non connecté');
            }

            console.log('[Effect] idUser reçu:', userId);

            return from(
              this.userRepositoryService.addSongToPlaylist(userId, playlistId, {
                idSong: song.id,
              })
            );
          }),
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

        return from(this.localStorageService.getItem('idUser')).pipe(
          switchMap((userId) => {
            if (typeof userId !== 'string' || !userId) {
              throw new Error('Utilisateur non connecté');
            }

            console.log('[Effect] idUser reçu:', userId);

            return from(
              this.userRepositoryService.removeSongFromPlaylist(
                userId,
                playlistId,
                songId
              )
            );
          }),
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
