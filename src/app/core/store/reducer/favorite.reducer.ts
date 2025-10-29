import { ISong } from '../../interfaces/song';
import { createReducer, on } from '@ngrx/store';
import * as FavoritesActions from '../action/favorites.actions';
import { IAlbum } from '../../interfaces/album';

export interface FavoritesState {
  songs: ISong[]; // IDs des chansons favorites
  albums: IAlbum[]; // IDs des albums favorites
  loading: boolean;
  error: any;
}

export const initialState: FavoritesState = {
  songs: [],
  albums: [],
  loading: false,
  error: null,
};

export const favoritesReducer = createReducer(
  initialState,

  // Songs
  on(FavoritesActions.addFavoriteSong, (state, { song }) => ({
    ...state,
    songs: [...state.songs, song],
  })),
  on(FavoritesActions.removeFavoriteSong, (state, { songId }) => ({
    ...state,
    songs: state.songs.filter((s) => s.id !== songId),
  })),

  // Albums
  on(FavoritesActions.addFavoriteAlbum, (state, { album }) => ({
    ...state,
    albums: [...state.albums, album],
  })),
  on(FavoritesActions.removeFavoriteAlbum, (state, { albumId }) => ({
    ...state,
    albums: state.albums.filter((a) => a.id !== albumId),
  })),

  // Load
  on(FavoritesActions.loadFavorites, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) => {
    console.log('[Reducer] updating favorites →', favorites);
    return {
      ...state,
      songs: favorites.songs,
      albums: favorites.albums,
      loading: false,
      error: null,
    };
  }),
  on(FavoritesActions.loadFavoritesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
