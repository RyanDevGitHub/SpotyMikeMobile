import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ISong } from '../../interfaces/song';
import { AppState } from '../app.state';
import { UserState } from '../reducer/user.reducer';

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
export const selectAuthToken = createSelector(
  selectUserState,
  (userState) => userState.token
);
export const selectUserId = createSelector(
  selectUserState,
  (userState) => userState.user?.id ?? null
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
      // 🎶 Ajout du log de débogage
      console.log('--- Traitement de la Playlist:', playlist.title, '---');
      console.log(
        'IDs de chansons dans la playlist (playlist.songs):',
        playlist.songs
      );
      console.log(
        'Entités de chansons disponibles (songsEntities):',
        songsEntities
      );

      const songs: ISong[] = playlist.songs
        // 🚨 CORRECTION ICI : Si l'élément est une chaîne (l'ID), on l'utilise directement.
        // On suppose que l'élément est soit une chaîne (l'ID), soit un objet avec un idSong.
        .map((song) => {
          // Détermine l'ID à utiliser
          const songId = typeof song === 'string' ? song : song?.idSong;

          const foundSong = songId ? songsEntities[songId] : undefined;

          // Log pour chaque ID
          if (!foundSong && songId) {
            console.log(`❌ Chanson non trouvée pour l'ID: ${songId}`);
          }
          if (!songId) {
            console.log(
              '⚠️ ID de chanson manquant ou non valide dans la source de la playlist:',
              song
            );
          }

          return foundSong;
        })
        .filter((song): song is ISong => song !== undefined); // 👈 type guard

      // 🎶 Log du résultat
      console.log('Chansons filtrées et trouvées (songs):', songs);

      return {
        ...playlist,
        songs, // maintenant TypeScript sait que c'est IMusic[]
      };
    });
  }
);
