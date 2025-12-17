// core/store/selectors/album.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AlbumsState } from '../reducer/album.reducer';

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

export const selectSongsByAlbumId = (albumId: string) =>
  createSelector(selectAllAlbums, (albums) => {
    console.log(albums);

    // 1. Trouver l'album par son ID
    const album = albums.find((a) => a.id === albumId);

    // 2. Si l'album est trouvé, renvoyer son tableau de chansons; sinon, renvoyer un tableau vide.
    console.log(`Selecting songs for album ID: ${albumId}`, album);
    return album ? album.songs : [];
  });

export const selectAlbumIdBySongId = (songId: string) =>
  createSelector(selectAllAlbums, (albums) => {
    console.log(`Searching for album containing Song ID: ${songId}`);

    // Trouver le premier album qui contient l'ID de cette chanson
    const album = albums.find((a) => a.songs.some((s) => s.id === songId));

    // Retourner l'ID de l'album ou null/undefined si non trouvé
    return album ? album.id : null;
  });
