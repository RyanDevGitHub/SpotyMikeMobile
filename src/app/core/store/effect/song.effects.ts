// core/store/effects/song.effects.ts
import { Injectable } from '@angular/core';
import { AppState } from '@capacitor/app';
import { Actions, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { ISong } from '../../interfaces/song';
import { loadSongSuccess } from '../action/song.action';
import { selectAllArtistInfos } from '../selector/artist.selector';
import { selectAllAlbums } from './../selector/album.selector';

@Injectable()
export class SongEffects {
  private storeSnapshot: AppState;
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
  ) {
    this.store.subscribe((state) => {
      this.storeSnapshot = state;
    });
  }

  loadSongsFromAlbums$ = createEffect(() =>
    combineLatest([
      this.store.select(selectAllAlbums),
      this.store
        .select(selectAllArtistInfos)
        .pipe(
          tap((artists) =>
            console.log('[Effect] Artists from selectAllArtistInfos:', artists),
          ),
        ),
    ]).pipe(
      filter(([albums, artists]) => albums.length > 0 && artists.length > 0),
      map(([albums, artists]) => {
        const songs: ISong[] = albums.flatMap((album) =>
          album.songs.map((song, songIndex) => {
            const artistInfo =
              artists.find((a) => a.userId === song.artistId) || null;
            console.log(
              `[Effect] Mapping song "${song.title}" (artistId: ${song.artistId}) -> artistInfo:`,
              artistInfo,
            );

            return {
              ...song,
              id: song.id || `${album.id}_${songIndex}`,
              albumId: album.id,
              albumInfo: {
                id: album.id,
                title: album.title,
                cover: album.cover,
              },
              artistInfo,
              createAt: song.createAt as Date,
            } as ISong;
          }),
        );

        console.log('[Effect] Derived songs with artists:', songs);
        return loadSongSuccess({ songs });
      }),
    ),
  );
}
