import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IArtistInfo } from '../../interfaces/artist';
import { ArtistsState } from '../reducer/artist.reducer';
import { selectAllSongs } from './song.selector';

export const selectArtistsState =
  createFeatureSelector<ArtistsState>('artists');

export const selectAllArtists = createSelector(
  selectArtistsState,
  (state) => state.artists
);

export const selectArtistById = (id: string) =>
  createSelector(selectArtistsState, (state) =>
    state.artists.find((artist) => artist.id === id)
  );

export const selectArtistsLoading = createSelector(
  selectArtistsState,
  (state) => state.loading
);

export const selectArtistsLoaded = createSelector(
  selectArtistsState,
  (state) => state.loaded
);

export const selectArtistsError = createSelector(
  selectArtistsState,
  (state) => state.error
);

export const selectAllArtistInfos = createSelector(
  selectAllArtists,
  (artists): IArtistInfo[] => {
    const infos = artists.map((artist) => ({
      id: artist.id,
      userId: artist.userId,
      firstName: artist.firstName,
      label: artist.label,
      avatar: artist.avatar,
    }));
    console.log('[Selector] All ArtistInfos:', infos); // <-- log pour vérifier
    return infos;
  }
);

export const selectSongsByArtistId = (artistId: string) =>
  createSelector(selectAllSongs, (songs) => {
    return songs.filter((song) => song.artistId === artistId);
  });
