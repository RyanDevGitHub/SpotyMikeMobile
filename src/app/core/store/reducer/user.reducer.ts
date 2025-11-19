import { createReducer, on } from '@ngrx/store';

import { IToken, IUser } from '../../interfaces/user';
import * as ActionUser from '../action/user.action';

export interface UserState {
  user: IUser | null; // Un seul utilisateur
  token: string | null | IToken; // Le token d'authentification
  loading: boolean; // Indique si un chargement est en cours
  error: string | null; // Stocke les erreurs
}

export const initialState: UserState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};
const normalizeError = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }
  // Fallback si l'erreur est un objet non conventionnel
  return 'Une erreur inconnue est survenue.';
};

export const userReducer = createReducer(
  initialState,
  // Début du chargement
  on(ActionUser.loadUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // Chargement réussi
  on(ActionUser.loadUserSuccess, (state, { user }) => {
    console.log('[Reducer] Updating state with user:', user);
    return {
      ...state,
      user, // Stocke l'utilisateur dans l'état
      loading: false,
    };
  }),

  // Échec du chargement
  on(ActionUser.loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Action déclenchée → on peut mettre loading à true
  on(ActionUser.addLastSongUser, (state) => {
    console.log('[Reducer] addLastSongUser triggered, setting loading = true');
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),

  // Succès → on remplace l’utilisateur complet avec updatedUser
  on(ActionUser.addLastSongUserSuccess, (state, { updatedUser }) => {
    console.log('[Reducer] addLastSongUserSuccess, updated user:', updatedUser);
    return {
      ...state,
      user: updatedUser,
      loading: false,
      error: null,
    };
  }),

  // Erreur → on garde l’ancien user, on stocke l’erreur
  on(ActionUser.addLastSongUserFailure, (state, { error }) => {
    console.error('[Reducer] addLastSongUserFailure, error:', error);
    return {
      ...state,
      loading: false,
      error,
    };
  }),
  // Début du update
  on(ActionUser.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ActionUser.updateUserSuccess, (state, { updatedUser }) => {
    console.log('[Reducer] Updating state with user:', updatedUser);

    return {
      ...state,
      user: {
        ...state.user, // garde les champs existants
        ...updatedUser, // merge les nouvelles valeurs
      },
      loading: false,
      error: null,
    };
  }),

  // Échec du update
  on(ActionUser.updateUserFailure, (state, { error }) => {
    console.error('[Reducer] update user, error:', error);
    return {
      ...state,
      loading: false,
      error,
    };
  }),
  on(ActionUser.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token: token ?? null,
    loading: false,
    error: null,
  })),
  on(ActionUser.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    loading: false,
    error,
  })),

  // LOGOUT
  on(ActionUser.logoutSuccess, (state) => ({
    ...state,
    user: null,
    token: null,
    loading: false,
    error: null,
  })),
  on(ActionUser.logoutFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ActionUser.createPlaylistSuccess, (state, { playlist }) => {
    console.log('🌟 createPlaylistSuccess dans reducer, playlist:', playlist);
    return {
      ...state,
      user: state.user
        ? {
            ...state.user,
            playlists: [...(state.user.playlists ?? []), playlist],
          }
        : null,
    };
  }),

  on(ActionUser.addSongToPlaylistSuccess, (state, { playlist }) => {
    if (!state.user) return state; // safeguard

    console.log('[Reducer] Ajout chanson à la playlist', playlist);

    return {
      ...state,
      user: {
        ...state.user,
        playlists: state.user.playlists.map((pl) =>
          pl.id === playlist.id ? playlist : pl,
        ),
      },
      loading: false,
      error: null,
    };
  }),
  on(
    ActionUser.removeSongFromPlaylistSuccess,
    (state, { playlistId, updatedPlaylist }) => {
      if (!state.user) return state; // ✅ safeguard

      console.log(
        '[Reducer] Suppression chanson de la playlist',
        updatedPlaylist,
      );

      return {
        ...state,
        user: {
          ...state.user,
          playlists: state.user.playlists.map((pl) =>
            pl.id === playlistId ? updatedPlaylist : pl,
          ),
        },
        loading: false,
        error: null,
      };
    },
  ),

  on(ActionUser.removeSongFromPlaylistFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: normalizeError(error),
  })),
);
