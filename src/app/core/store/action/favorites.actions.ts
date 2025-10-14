import { ISong } from '../../interfaces/song';
import { createAction, props } from '@ngrx/store';

// Ajouter une chanson en favoris
export const addFavorite = createAction(
  '[Favorites] Add Favorite',
  props<{ userId: string; song: ISong }>()
);

// Retirer une chanson des favoris
export const removeFavorite = createAction(
  '[Favorites] Remove Favorite',
  props<{ userId: string; songId: string }>() // on supprime via l’id, plus simple
);

export const loadFavorites = createAction(
  '[Favorites] Load Favorites',
  props<{ userId: string | undefined }>()
);

// Succès du chargement (par exemple après appel API)
export const loadFavoritesSuccess = createAction(
  '[Favorites] Load Favorites Success',
  props<{ favorites: ISong[] }>()
);

// Erreur du chargement
export const loadFavoritesFailure = createAction(
  '[Favorites] Load Favorites Failure',
  props<{ error: any }>()
);

export const addFavoriteSuccess = createAction(
  '[Favorites] Add Favorites Success',
  props<{ favorites: ISong }>()
);

// Erreur du chargement
export const addFavoriteFailure = createAction(
  '[Favorites] Add Favorites Failure',
  props<{ error: any }>()
);

export const removeFavoriteSuccess = createAction(
  '[Favorites] Remove Favorites Success',
  props<{ favorites: string }>()
);

// Erreur du chargement
export const removeFavoriteFailure = createAction(
  '[Favorites] Remove Favorites Failure',
  props<{ error: any }>()
);
