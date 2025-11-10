import { createAction, props } from '@ngrx/store';

import { IAlbum } from '../../interfaces/album';
import { ISong } from '../../interfaces/song';
import { FavoritesState } from '../reducer/favorite.reducer';

// Songs
export const addFavoriteSong = createAction(
  '[Favorites] Add Favorite Song',
  props<{ userId: string; song: ISong }>(),
);

export const removeFavoriteSong = createAction(
  '[Favorites] Remove Favorite Song',
  props<{ userId: string; songId: string }>(),
);

// Albums
export const addFavoriteAlbum = createAction(
  '[Favorites] Add Favorite Album',
  props<{ userId: string; album: IAlbum }>(),
);

export const removeFavoriteAlbum = createAction(
  '[Favorites] Remove Favorite Album',
  props<{ userId: string; albumId: string }>(),
);

// Load favorites
export const loadFavorites = createAction(
  '[Favorites] Load Favorites',
  props<{ userId: string }>(),
);

export const loadFavoritesSuccess = createAction(
  '[Favorites] Load Favorites Success',
  props<{ favorites: FavoritesState }>(),
);

export const loadFavoritesFailure = createAction(
  '[Favorites] Load Favorites Failure',
  props<{ error: unknown }>(),
);
