import { ISong } from '../../interfaces/song';
import { createReducer, on } from '@ngrx/store';
import * as FavoritesActions from '../action/favorites.actions';

export interface FavoritesState {
  favorites: ISong[];
  loading: boolean;
  error: any;
}

export const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null,
};

export const favoritesReducer = createReducer(
  initialState,

  // Ajouter
  on(FavoritesActions.addFavorite, (state, { song }) => {
    console.log('[Reducer] addFavorite → ajout musique :', song);
    return {
      ...state,
      favorites: [...(state.favorites || []), song],
    };
  }),

  // Supprimer
  on(FavoritesActions.removeFavorite, (state, { songId }) => {
    console.log('[Reducer] removeFavorite → suppression musiqueId :', songId);
    return {
      ...state,
      favorites: state.favorites.filter((m) => m.id !== songId),
    };
  }),

  // Charger
  on(FavoritesActions.loadFavorites, (state) => {
    console.log('[Reducer] loadFavorites → mise en loading');
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),

  on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) => {
    console.log(
      '[Reducer] loadFavoritesSuccess → favoris chargés :',
      favorites
    );
    return {
      ...state,
      favorites,
      loading: false,
    };
  }),

  on(FavoritesActions.loadFavoritesFailure, (state, { error }) => {
    console.error('[Reducer] loadFavoritesFailure → erreur :', error);
    return {
      ...state,
      loading: false,
      error,
    };
  })
);
