import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ISong } from '../../interfaces/song';
import * as ActionSOngs from '../action/song.action';

  export interface SongsState extends EntityState<ISong> {
    loading: boolean;
    error: string | null;
  }

export const adapter: EntityAdapter<ISong> = createEntityAdapter<ISong>();

// Initialisation de l'état avec les valeurs par défaut fournies par l'adapter
export const initialState: SongsState = adapter.getInitialState({
  loading: false,
  error: null,
});

export const musicReducer = createReducer(
  initialState,
  on(
    ActionSOngs.loadSongsFromAlbums,
    (state) => (
      console.log('[Reducer] Loading songs...'),
      {
        ...state,
        loading: true,
        error: null,
      }
    ),
  ),
  on(ActionSOngs.loadSongSuccess, (state, { songs }) => {
    console.log('[Reducer] Updating state with songs:', songs);
    return adapter.setAll(songs, state);
  }),
  on(
    ActionSOngs.loadSongFailure,
    (state, { error }) => (
      console.log('[Reducer] Loading songs failed...'),
      {
        ...state,
        loading: false,
        error,
      }
    ),
  ),
);

// Générer les sélecteurs
const { selectAll, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors();

export const selectAllSongs = selectAll;
export const selectSongEntities = selectEntities;
export const selectSongIds = selectIds;
export const selectTotalSongs = selectTotal;
