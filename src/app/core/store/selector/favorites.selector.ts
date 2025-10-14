import { FavoritesState } from './../reducer/favorite.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectSortState } from './sort.selectors';
import { SortState } from '../reducer/sort.reducer';

export const selectFavoritesState =
  createFeatureSelector<FavoritesState>('favorites');

export const selectFavorites = createSelector(selectFavoritesState, (state) => {
  console.log('[Selector] selectFavorites →', state.favorites);
  return state.favorites;
});

export const isFavorite = (musicId: string) =>
  createSelector(selectFavorites, (favorites) => {
    const result = favorites.some((song) => song.id === musicId);
    console.log(`[Selector] isFavorite(${musicId}) →`, result);
    return result;
  });

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

export const selectSortedFavorites = createSelector(
  selectFavorites,
  selectSortState,
  (favorites, sortState) => {
    const sort = sortState.favoris; // ou le nom de page que tu as choisi
    if (!sort) return favorites;

    return [...favorites].sort((a, b) => {
      switch (sort.key) {
        case 'title':
          return sort.direction === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
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
  }
);
