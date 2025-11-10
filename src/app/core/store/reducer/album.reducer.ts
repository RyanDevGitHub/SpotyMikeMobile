import { createReducer, on } from '@ngrx/store';

import { IAlbum } from '../../interfaces/album';
import {
  loadAlbums,
  loadAlbumsFailure,
  loadAlbumsSuccess,
} from '../action/album.acton';

export interface AlbumsState {
  albums: IAlbum[];
  loading: boolean;
  error: string | null;
}

export const initialAlbumsState: AlbumsState = {
  albums: [],
  loading: false,
  error: null,
};

export const albumReducer = createReducer(
  initialAlbumsState,

  on(loadAlbums, (state) => {
    console.log('[AlbumReducer] loadAlbums triggered → loading...');
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),

  on(loadAlbumsSuccess, (state, { albums }) => {
    console.log('[AlbumReducer] loadAlbumsSuccess → albums loaded:', albums);
    return {
      ...state,
      albums,
      loading: false,
    };
  }),

  on(loadAlbumsFailure, (state, { error }) => {
    console.error('[AlbumReducer] loadAlbumsFailure → error:', error);
    return {
      ...state,
      loading: false,
      error,
    };
  }),
);
