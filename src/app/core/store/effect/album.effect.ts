// core/store/effects/album.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  loadAlbums,
  loadAlbumsFailure,
  loadAlbumsSuccess,
} from '../action/album.acton';
import { MusicServiceService } from '../../services/music-service.service';
import { loadArtistsSuccess } from '../action/artist.action';

@Injectable()
export class AlbumEffects {
  constructor(
    private actions$: Actions,
    private musicService: MusicServiceService
  ) {}

  loadAlbums$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAlbums),
      tap(() => console.log('[Effect] loadAlbums triggered')), // ← log dès que l'action est interceptée
      switchMap(() =>
        this.musicService.getAlbums().pipe(
          tap((albums) =>
            console.log('[Effect] Albums fetched from Firebase:', albums)
          ), // ← log résultat
          map((albums) => loadAlbumsSuccess({ albums })),
          catchError((error) => {
            console.error('[Effect] Error loading albums:', error); // ← log erreur
            return of(loadAlbumsFailure({ error }));
          })
        )
      )
    )
  );

  loadAlbumsAfterArtists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadArtistsSuccess), // 👈 attend que les artistes soient chargés
      map(() => loadAlbums()) // 👈 déclenche ensuite le chargement des albums
    )
  );
}
