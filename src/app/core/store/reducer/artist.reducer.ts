import { createReducer, on } from '@ngrx/store';

import { IArtist } from '../../interfaces/user';
import {
  loadArtists,
  loadArtistsFailure,
  loadArtistsSuccess,
} from '../action/artist.action';

export interface ArtistsState {
  artists: IArtist[];
  loading: boolean;
  loaded: boolean; // ✅ indique si les artistes ont été chargés
  error: string | null;
}

export const initialState: ArtistsState = {
  artists: [],
  loading: false,
  loaded: false, // ✅ initialement false
  error: null,
};

export const artistsReducer = createReducer(
  initialState,

  // Quand on lance le chargement
  on(loadArtists, (state) => {
    console.log('[Reducer] loadArtists triggered');
    return { ...state, loading: true, error: null };
  }),

  // Quand le chargement réussit
  on(loadArtistsSuccess, (state, { artists }) => {
    console.log('[Reducer] loadArtistsSuccess - artists received:', artists);
    return {
      ...state,
      loading: false,
      loaded: true, // ✅ artistes désormais chargés
      artists,
      error: null,
    };
  }),

  // En cas d’erreur
  on(loadArtistsFailure, (state, { error }) => {
    console.error('[Reducer] loadArtistsFailure - error:', error);
    return { ...state, loading: false, loaded: false, error };
  }),
);
