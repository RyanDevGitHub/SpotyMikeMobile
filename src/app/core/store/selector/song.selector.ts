import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ISong } from '../../interfaces/song';
import { adapter, SongsState } from '../reducer/song.reducer';
import { selectSortState } from './sort.selectors';
import { selectUser, selectUserPlaylists } from './user.selector';
// Sélecteur pour récupérer l'état de la musique
export const selectMusicState = createFeatureSelector<SongsState>('music');

// Sélecteurs générés par l'adapter
const { selectEntities, selectIds, selectTotal } = adapter.getSelectors();

// Sélecteurs spécifiques
export const selectAllSongs = createSelector(selectMusicState, (state) =>
  state ? adapter.getSelectors().selectAll(state) : []
);

export const selectLastPlayedSongs = createSelector(selectAllSongs, (songs) => {
  console.log('[Selector] LastPlayedSongs selectAllSongs:', songs);
  return songs;
});

export const selectSongEntities = createSelector(
  selectMusicState,
  selectEntities
);
export const selectSongIds = createSelector(selectMusicState, selectIds);
export const selectTotalSongs = createSelector(selectMusicState, selectTotal);

// Sélecteurs pour charger l'état de la musique
export const selectLoading = createSelector(
  selectMusicState,
  (state) => state.loading
);
export const selectError = createSelector(
  selectMusicState,
  (state) => state.error
);

export const debugSelectAllSongs = createSelector(selectAllSongs, (songs) => {
  console.log('[Selector] Songs from selectAllSongs:', songs);
  return songs;
});

/**
 * Sélecteur pour filtrer les chansons par genre.
 * @param genre Genre à filtrer, 'All' pour toutes les chansons
 */
export const selectFilteredAndSortedSongsByGenre = (genre: string) =>
  createSelector(selectAllSongs, selectSortState, (songs, sortState) => {
    // Filtrage par genre
    const filteredSongs =
      genre && genre !== 'All'
        ? songs.filter((song) => song.genre === genre)
        : songs;

    // Récupérer le tri pour music_genre
    const sort = sortState.music_genre; // clé fixe dans SortState
    if (!sort) return filteredSongs;

    // Trier
    return [...filteredSongs].sort((a, b) => {
      switch (sort.key) {
        case 'title':
          return sort.direction === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        case 'artist':
          return sort.direction === 'asc'
            ? (a.artistInfo?.firstName || '').localeCompare(
                b.artistInfo?.firstName || ''
              )
            : (b.artistInfo?.firstName || '').localeCompare(
                a.artistInfo?.firstName || ''
              );
        case 'album':
          return sort.direction === 'asc'
            ? (a.albumInfo?.title || '').localeCompare(b.albumInfo?.title || '')
            : (b.albumInfo?.title || '').localeCompare(
                a.albumInfo?.title || ''
              );
        default:
          return 0;
      }
    });
  });

export const selectRecentSongs = createSelector(selectAllSongs, (songs) => {
  console.log('[Selector] All songs from store:', songs);

  const recentSongs = songs
    .filter((song) => song.createAt)
    .sort((a, b) => b.createAt.getTime() - a.createAt.getTime())
    .slice(0, 3);

  console.log('[Selector] Recent 3 songs:', recentSongs);
  return recentSongs;
});

// function toDate(timestamp: { seconds: number; nanoseconds: number }): Date {
//   return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
// }

// Sélecteur pour les 5 chansons avec le plus de listeningCount
export const selectTopSongsByListeningCount = createSelector(
  selectAllSongs,
  (songs) => {
    return songs
      .sort((a, b) => Number(b.listeningCount) - Number(a.listeningCount)) // convertir en nombre pour trier
      .slice(0, 5); // top 5 chansons
  }
);

export const selectSortedTopSongs = createSelector(
  selectAllSongs,
  selectSortState,
  (songs, sortState) => {
    // On récupère le tri pour la page 'topSongs'
    const sort = sortState.top_songs;
    if (!sort) {
      // Si pas de tri, on fait le top 5 par écoute par défaut
      return [...songs]
        .sort((a, b) => Number(b.listeningCount) - Number(a.listeningCount))
        .slice(0, 5);
    }

    // Sinon, on trie selon la clé et la direction
    const sorted = [...songs].sort((a, b) => {
      switch (sort.key) {
        case 'title':
          return sort.direction === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        case 'artist':
          return sort.direction === 'asc'
            ? (a.artistInfo?.firstName || '').localeCompare(
                b.artistInfo?.firstName || ''
              )
            : (b.artistInfo?.firstName || '').localeCompare(
                a.artistInfo?.firstName || ''
              );
        case 'album':
          return sort.direction === 'asc'
            ? (a.albumInfo?.title || '').localeCompare(b.albumInfo?.title || '')
            : (b.albumInfo?.title || '').localeCompare(
                a.albumInfo?.title || ''
              );
        case 'listeningCount':
          return sort.direction === 'asc'
            ? Number(a.listeningCount) - Number(b.listeningCount)
            : Number(b.listeningCount) - Number(a.listeningCount);
        default:
          return 0;
      }
    });

    // Top 5 chansons
    return sorted.slice(0, 5);
  }
);

export const selectLastSongsByUser = createSelector(
  selectUser,
  selectAllSongs,
  (user, songs): ISong[] => {
    console.log('[Selector] User last songs IDs:', user?.lastsPlayed);
    if (!user || !user.lastsPlayed) {
      return []; // Retourner une liste vide si l'utilisateur ou lastSongs est indéfini
    }
    return user.lastsPlayed
      .map((songId) => songs.find((song) => song.id === songId))
      .filter((song): song is ISong => song !== undefined); // Filtrer et garantir le type
  }
);

export const selectSongsBySearchTerm = (searchTerm: string) =>
  createSelector(selectAllSongs, (songs) => {
    console.log(
      '[Selector] selectSongsBySearchTerm: Songs before filtering:',
      songs
    ); // Avant filtrage
    const lowerCaseTerm = searchTerm.toLowerCase();
    const filteredSongs = songs.filter((song) =>
      song.title.toLowerCase().includes(lowerCaseTerm)
    );
    console.log(
      '[Selector] selectSongsBySearchTerm: Filtered songs:',
      filteredSongs
    ); // Après filtrage
    return filteredSongs;
  });

export const selectFavoriteSongsByUser = createSelector(
  selectUser,
  selectAllSongs,
  (user, songs): ISong[] => {
    console.log('[Selector] User favorite song IDs:', user);
    if (!user || !user.favorites) {
      return []; // Retourner une liste vide si l'utilisateur ou favorites est indéfini
    }
    return user.favorites.songs
      .map((songId) => songs.find((song) => song.id === songId))
      .filter((song): song is ISong => song !== undefined);
  }
);

export const selectSortedLastPlayedSongs = createSelector(
  selectLastSongsByUser,
  selectSortState,
  (lastPlayedSongs, sortState) => {
    const sort = sortState.lastPlayed; // page "lastPlayed" dans le store
    console.log('📝 SortState lastPlayed:', sort);
    console.log('📝 LastPlayedSongs avant tri:', lastPlayedSongs);

    if (!sort) return lastPlayedSongs;

    const sorted = [...lastPlayedSongs].sort((a, b) => {
      switch (sort.key) {
        case 'title':
          return sort.direction === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        case 'artist':
          return sort.direction === 'asc'
            ? (a.artistInfo?.firstName || '').localeCompare(
                b.artistInfo?.firstName || ''
              )
            : (b.artistInfo?.firstName || '').localeCompare(
                a.artistInfo?.firstName || ''
              );
        case 'album':
          return sort.direction === 'asc'
            ? (a.albumInfo?.title || '').localeCompare(b.albumInfo?.title || '')
            : (b.albumInfo?.title || '').localeCompare(
                a.albumInfo?.title || ''
              );
        default:
          return 0;
      }
    });

    console.log('📝 LastPlayedSongs après tri:', sorted, 'avec sort:', sort);
    return sorted;
  }
);
export const selectSongsByPlaylistId = (playlistId: string) =>
  createSelector(selectUserPlaylists, (playlists) => {
    // 1. Trouver la playlist par son ID
    const playlist = playlists.find((p) => p.id === playlistId);

    // 2. Si la playlist est trouvée, retourner son tableau de chansons; sinon, un tableau vide.
    return playlist ? playlist.songs : [];
  });
