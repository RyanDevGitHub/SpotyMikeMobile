import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FavoritesService } from '../../services/repositories/favorites.service';
import * as FavoritesActions from '../action/favorites.actions';
import {
  catchError,
  filter,
  from,
  map,
  mergeMap,
  of,
  tap,
  withLatestFrom,
} from 'rxjs';
import { ISong } from '../../interfaces/song';
import { selectArtistsLoaded } from '../selector/artist.selector';
import { Store } from '@ngrx/store';
import { loadAlbumsSuccess } from '../action/album.acton';
import { selectUser } from '../selector/user.selector';
import { IUser } from '../../interfaces/user';
import { loadSongSuccess } from '../action/song.action';

@Injectable()
export class FavoritesEffects {
  constructor(
    private actions$: Actions,
    private favoritesService: FavoritesService,
    private store: Store // 👈 injection du sto
  ) {}

  //Charger les favoris depuis Firebase
  loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.loadFavorites),
      tap(({ userId }) =>
        console.log('[Effect] loadFavorites triggered', { userId })
      ),
      mergeMap(({ userId }) =>
        from(this.favoritesService.getUserFavorites(userId)).pipe(
          tap((favorites) =>
            console.log('[Effect] Favorites récupérés du service :', favorites)
          ),
          map((favorites) =>
            FavoritesActions.loadFavoritesSuccess({
              favorites: favorites as ISong[],
            })
          ),
          catchError((error) =>
            of(FavoritesActions.loadFavoritesFailure({ error }))
          )
        )
      )
    )
  );

  // loadFavorites$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(FavoritesActions.loadFavorites),
  //     tap((action) => console.log('[Effect] loadFavorites triggered', action)),
  //     withLatestFrom(this.store.select(selectArtistsLoaded)),
  //     tap(([action, artistsLoaded]) =>
  //       console.log('[Effect] artistsLoaded flag:', artistsLoaded)
  //     ),
  //     filter(([_, artistsLoaded]) => {
  //       const pass = artistsLoaded;
  //       if (!pass) console.log('[Effect] Artists not loaded yet, skipping...');
  //       return pass;
  //     }),
  //     mergeMap(([{ userId }]) => {
  //       console.log('[Effect] Loading favorites for userId:', userId);
  //       return from(this.favoritesService.getUserFavorites(userId)).pipe(
  //         tap((favorites) =>
  //           console.log('[Effect] Favorites fetched:', favorites)
  //         ),
  //         map((favorites) =>
  //           FavoritesActions.loadFavoritesSuccess({ favorites })
  //         ),
  //         catchError((error) => {
  //           console.error('[Effect] Error loading favorites:', error);
  //           return of(FavoritesActions.loadFavoritesFailure({ error }));
  //         })
  //       );
  //     })
  //   )
  // );
  loadFavoritesAfterAlbums$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSongSuccess), // Quand les songs sont chargés
      withLatestFrom(
        this.store
          .select(selectUser)
          .pipe(filter((user): user is IUser => !!user)) // On attend que le user soit dispo
      ),
      map(([_, user]) => {
        console.log(
          '[Effect] Songs chargés → chargement des favoris pour',
          user.id
        );
        return FavoritesActions.loadFavorites({ userId: user.id });
      })
    )
  );

  // Ajouter un favori
  addFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.addFavorite),
      tap((action) =>
        console.log('[Effect] Action addFavorite reçue :', action)
      ),
      mergeMap((action) =>
        from(
          this.favoritesService.addFavorite(action.userId, action.song.id)
        ).pipe(
          tap(() =>
            console.log(
              '[Service] Appel addFavorite terminé pour :',
              action.song
            )
          ),
          map(() => {
            console.log(
              '[Effect] Dispatch addFavoriteSuccess pour :',
              action.song
            );
            return FavoritesActions.addFavoriteSuccess({
              favorites: action.song,
            });
          }),
          catchError((error) => {
            console.error('[Effect] Erreur addFavorite :', error);
            return of(FavoritesActions.addFavoriteFailure({ error }));
          })
        )
      )
    )
  );

  // Supprimer un favori
  removeFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.removeFavorite),
      tap((action) =>
        console.log('[Effect] Action removeFavorite reçue :', action)
      ),
      mergeMap((action) =>
        from(
          this.favoritesService.removeFavorite(action.userId, action.songId)
        ).pipe(
          tap(() =>
            console.log(
              '[Service] Appel removeFavorite terminé pour :',
              action.songId
            )
          ),
          map(() => {
            console.log(
              '[Effect] Dispatch removeFavoriteSuccess pour :',
              action.songId
            );
            return FavoritesActions.removeFavoriteSuccess({
              favorites: action.songId,
            });
          }),
          catchError((error) => {
            console.error('[Effect] Erreur removeFavorite :', error);
            return of(FavoritesActions.removeFavoriteFailure({ error }));
          })
        )
      )
    )
  );
}
