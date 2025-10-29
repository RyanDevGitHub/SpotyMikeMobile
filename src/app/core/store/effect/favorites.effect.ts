import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FavoritesService } from './../../services/favoris.service';

import { Store } from '@ngrx/store';
import { catchError, from, map, mergeMap, of, withLatestFrom } from 'rxjs';
import * as FavoritesActions from '../action/favorites.actions';
import { loadSongSuccess } from '../action/song.action';
import { FavoritesState } from '../reducer/favorite.reducer';
import { selectUser } from '../selector/user.selector';

@Injectable()
export class FavoritesEffects {
  constructor(
    private actions$: Actions,
    private favoritesService: FavoritesService,
    private store: Store // 👈 injection du sto
  ) {}

  // 🔹 Charger les favoris (songs + albums complets)
  loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.loadFavorites),
      mergeMap(({ userId }) =>
        from(this.favoritesService.getUserFavorites(userId)).pipe(
          map(({ songs, albums }) => {
            const favoritesState: FavoritesState = {
              songs,
              albums,
              loading: false,
              error: null,
            };
            console.log('load favorite success in effect →', favoritesState);
            return FavoritesActions.loadFavoritesSuccess({
              favorites: favoritesState,
            });
          }),
          catchError((error) =>
            of(FavoritesActions.loadFavoritesFailure({ error }))
          )
        )
      )
    )
  );

  loadFavoritesAfterSongs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSongSuccess),
      withLatestFrom(this.store.select(selectUser)),
      map(([_, user]) => {
        if (!user?.id) return { type: 'NO_USER' }; // sécurité
        return FavoritesActions.loadFavorites({ userId: user.id });
      })
    )
  );

  // ➕ Ajouter une chanson aux favoris
  addFavoriteSong$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.addFavoriteSong),
      mergeMap(({ userId, song }) =>
        from(this.favoritesService.addFavorite(userId, 'song', song)).pipe(
          // Recharge la liste à jour
          map(() => FavoritesActions.loadFavorites({ userId })),
          catchError((error) =>
            of(FavoritesActions.loadFavoritesFailure({ error }))
          )
        )
      )
    )
  );

  // ❌ Retirer une chanson des favoris
  removeFavoriteSong$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.removeFavoriteSong),
      mergeMap(({ userId, songId }) =>
        from(this.favoritesService.removeFavorite(userId, 'song', songId)).pipe(
          map(() => FavoritesActions.loadFavorites({ userId })),
          catchError((error) =>
            of(FavoritesActions.loadFavoritesFailure({ error }))
          )
        )
      )
    )
  );

  // ➕ Ajouter un album aux favoris
  addFavoriteAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.addFavoriteAlbum),
      mergeMap(({ userId, album }) =>
        from(this.favoritesService.addFavorite(userId, 'album', album)).pipe(
          map(() => FavoritesActions.loadFavorites({ userId })),
          catchError((error) =>
            of(FavoritesActions.loadFavoritesFailure({ error }))
          )
        )
      )
    )
  );

  // ❌ Retirer un album des favoris
  removeFavoriteAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.removeFavoriteAlbum),
      mergeMap(({ userId, albumId }) =>
        from(
          this.favoritesService.removeFavorite(userId, 'album', albumId)
        ).pipe(
          map(() => FavoritesActions.loadFavorites({ userId })),
          catchError((error) =>
            of(FavoritesActions.loadFavoritesFailure({ error }))
          )
        )
      )
    )
  );
}
