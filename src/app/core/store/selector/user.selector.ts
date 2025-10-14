import { map } from 'rxjs';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { UserState } from '../reducer/user.reducer';
import { ISong } from '../../interfaces/song';

export const selectSongsEntities = (state: AppState) => state.music.entities;

// Sélecteur pour accéder à l'état utilisateur
export const selectUserState = createFeatureSelector<UserState>('user');

// Sélecteur pour récupérer l'utilisateur unique
export const selectUser = createSelector(selectUserState, (state) => {
  console.log('[Selector] User in state:', state.user);
  return state.user;
});

// Sélecteur pour vérifier si un chargement est en cours
export const selectUserLoading = createSelector(
  selectUserState,
  (state) => state.loading
);

// Sélecteur pour récupérer les éventuelles erreurs
export const selectUserError = createSelector(
  selectUserState,
  (state) => state.error
);

// Sélecteurs pour charger l'état de la musique
export const selectLoading = createSelector(
  selectUserState,
  (state) => state.loading
);
export const selectError = createSelector(
  selectUserState,
  (state) => state.error
);

export const selectUserPlaylists = createSelector(
  selectUser,
  selectSongsEntities,
  (user, songsEntities) => {
    if (!user?.playlists) return [];

    return user.playlists.map((playlist) => {
      const songs: ISong[] = playlist.songs
        .map((song) => songsEntities[song.idSong])
        .filter((song): song is ISong => song !== undefined); // 👈 type guard

      return {
        ...playlist,
        songs, // maintenant TypeScript sait que c'est IMusic[]
      };
    });
  }
);
