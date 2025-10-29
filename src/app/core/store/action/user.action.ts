import { createAction, props } from '@ngrx/store';
import {
  IToken,
  IUser,
  IUserDataBase,
  IUserUpdateDataBase,
} from '../../interfaces/user';
import { IPlaylist, IPlaylistRaw } from '../../interfaces/playlistes';
import { ISong } from '../../interfaces/song';

export const loadUser = createAction('[User] Load User');
export const loadUserSuccess = createAction(
  '[User] Load User Success',
  props<{ user: IUser }>(),
);
export const loadUserFailure = createAction(
  '[User] Load User Failure',
  props<{ error: string }>(),
);

// Action pour déclencher l'ajout de la musique
export const addLastSongUser = createAction(
  '[User] Add Last Song User',
  props<{ songId: string }>(),
);

// Action de succès : renvoie l'utilisateur complet mis à jour
export const addLastSongUserSuccess = createAction(
  '[User] Add Last Song User Success',
  props<{ updatedUser: IUser }>(),
);

// Action d'échec
export const addLastSongUserFailure = createAction(
  '[User] Add Last Song User Failure',
  props<{ error: string }>(),
);

export const updateUser = createAction(
  '[User] Update User',
  props<{ userId: string; changes: IUserUpdateDataBase }>(),
);

export const updateUserSuccess = createAction(
  '[User] Update User Success',
  props<{ updatedUser: IUser }>(),
);

export const updateUserFailure = createAction(
  '[User] Update User Failure',
  props<{ error: string }>(),
);
// ---- AUTH LOGOUT ----
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: string }>(),
);
// ---- AUTH LOGIN ----
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>(),
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: IUser | null; token: IToken }>(),
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>(),
);

// ---- CREATE PLAYLIST ----
export const createPlaylist = createAction(
  '[Playlist] Create Playlist',
  props<{ title: string; song: ISong }>(),
);

export const createPlaylistSuccess = createAction(
  '[Playlist] Create Playlist Success',
  props<{ playlist: IPlaylistRaw }>(),
);

export const createPlaylistFailure = createAction(
  '[Playlist] Create Playlist Failure',
  props<{ error: string }>(),
);

// ---- ADD TO PLAYLIST ----
export const addSongToPlaylist = createAction(
  '[Playlist] Add song to Playlist',
  props<{ playlistId: string; song: ISong }>(),
);

export const addSongToPlaylistSuccess = createAction(
  '[Playlist] Add song Playlist Success',
  props<{ playlist: IPlaylistRaw }>(),
);

export const addSongToPlaylistFailure = createAction(
  '[Playlist] Add song Playlist Failure',
  props<{ error: string }>(),
);

// 🔥 Supprimer une chanson d'une playlist
export const removeSongFromPlaylist = createAction(
  '[Playlist] Remove Song From Playlist',
  props<{ playlistId: string; songId: string }>(),
);

export const removeSongFromPlaylistSuccess = createAction(
  '[Playlist] Remove Song From Playlist Success',
  props<{ playlistId: string; updatedPlaylist: IPlaylistRaw }>(),
);

export const removeSongFromPlaylistFailure = createAction(
  '[Playlist] Remove Song From Playlist Failure',
  props<{ error: any }>(),
);
