// core/store/selectors/album.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AlbumsState } from '../reducer/album.reducer';
import { ISong } from '../../interfaces/song';
import { IAlbum } from '../../interfaces/album';

export const selectAlbumsState = createFeatureSelector<AlbumsState>('albums');

export const selectAllAlbums = createSelector(
  selectAlbumsState,
  (state) => state.albums
);

export const selectAlbumsLoading = createSelector(
  selectAlbumsState,
  (state) => state.loading
);

export const selectAlbumsError = createSelector(
  selectAlbumsState,
  (state) => state.error
);

export const selectAlbumById = (albumId: string) =>
  createSelector(selectAllAlbums, (albums) =>
    albums.find((a) => a.id === albumId)
  );

export const selectRecentAlbums = createSelector(selectAllAlbums, (albums) =>
  [...albums].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
);

export const selectAlbumBySong = (songId: string) =>
  createSelector(selectAllAlbums, (albums) =>
    albums.find((album) => album.songs.some((music) => music.id === songId))
  );
