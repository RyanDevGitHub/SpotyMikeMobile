import { FavoritesState } from './../reducer/favorite.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectSortState } from './sort.selectors';
import { SortState } from '../reducer/sort.reducer';
import { ISong } from '../../interfaces/song';
import { IAlbum } from '../../interfaces/album';

export const selectFavoritesState =
  createFeatureSelector<FavoritesState>('favorites');

// 🎵 Sélecteurs de base
export const selectFavoriteSongs = createSelector(
  selectFavoritesState,
  (state) => {
    console.log('[Selector] selectFavoriteSongs →', state.songs);
    return state.songs;
  }
);

export const selectFavoriteAlbums = createSelector(
  selectFavoritesState,
  (state) => {
    console.log('[Selector] selectFavoriteAlbums →', state.albums);
    return state.albums;
  }
);

// ⚙️ Loading & Error
export const selectFavoritesLoading = createSelector(
  selectFavoritesState,
  (state) => {
    console.log('[Selector] selectFavoritesLoading →', state.loading);
    return state.loading;
  }
);

export const selectFavoritesError = createSelector(
  selectFavoritesState,
  (state) => {
    console.log('[Selector] selectFavoritesError →', state.error);
    return state.error;
  }
);

// 🎧 Savoir si une chanson est favorite
export const isFavoriteSong = (songId: string) =>
  createSelector(selectFavoriteSongs, (songs) => {
    const result = songs.some((song: ISong) => song.id === songId);
    console.log(`[Selector] isFavoriteSong(${songId}) →`, result);
    return result;
  });

// 💿 Savoir si un album est favori
export const isFavoriteAlbum = (albumId: string) =>
  createSelector(selectFavoriteAlbums, (albums) => {
    const result = albums.some((album: IAlbum) => album.id === albumId);
    console.log(`[Selector] isFavoriteAlbum(${albumId}) →`, result);
    return result;
  });

// 🔢 Tous les favoris combinés (utile si tu veux tout afficher ensemble)
export const selectAllFavorites = createSelector(
  selectFavoriteSongs,
  selectFavoriteAlbums,
  (songs, albums) => {
    const favorites = { songs, albums };
    console.log('[Selector] selectAllFavorites →', favorites);
    return favorites;
  }
);

// 🔠 Tri des favoris selon le sortState
export const selectSortedFavorites = createSelector(
  selectAllFavorites, // { songs: ISong[]; albums: IAlbum[] }
  selectSortState,
  (favorites, sortState) => {
    const sort = sortState.favoris;
    if (!sort) return favorites; // si aucun tri → on renvoie tel quel

    // 🧩 On combine d’abord les deux listes pour trier
    const combined = [...favorites.songs, ...favorites.albums];

    // 🔢 On applique le tri selon la clé choisie
    const sorted = [...combined].sort((a: any, b: any) => {
      switch (sort.key) {
        case 'title':
          return sort.direction === 'asc'
            ? (a.title || '').localeCompare(b.title || '')
            : (b.title || '').localeCompare(a.title || '');

        case 'artist':
          return sort.direction === 'asc'
            ? (a.artistInfo?.firstName || '').localeCompare(
                b.artistInfo?.firstName || ''
              )
            : (b.artistInfo?.firstName || '').localeCompare(
                a.artistInfo?.firstName || ''
              );

        case 'album':
          return sort.direction === 'asc'
            ? (a.albumInfo?.title || '').localeCompare(b.albumInfo?.title || '')
            : (b.albumInfo?.title || '').localeCompare(
                a.albumInfo?.title || ''
              );

        default:
          return 0;
      }
    });

    // 🧱 On peut choisir :
    // 👉 soit renvoyer le tableau trié combiné
    // 👉 soit rediviser par type si besoin

    return {
      songs: sorted.filter((item): item is ISong => 'artistInfo' in item),
      albums: sorted.filter((item): item is IAlbum => !('artistInfo' in item)),
    };
  }
);
