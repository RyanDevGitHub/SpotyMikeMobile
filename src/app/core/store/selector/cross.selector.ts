import { createSelector } from '@ngrx/store';

import { IAlbum } from '../../interfaces/album';
import { ISong } from '../../interfaces/song';
import { IArtist } from '../../interfaces/user';
import { selectAllAlbums } from './album.selector';
import { selectAllArtists } from './artist.selector';
import { selectAllSongs } from './song.selector';
export const selectSearchResults = (searchTerm: string) =>
  createSelector(
    selectAllSongs,
    selectAllAlbums,
    selectAllArtists,
    (songs: ISong[], albums: IAlbum[], artists: IArtist[]) => {
      const lowerTerm = searchTerm.toLowerCase();

      const filteredSongs = songs.filter((song) => {
        if (!song || !song.title) {
          console.error("🚨 ERREUR: Cette musique n'a pas de titre :", song);
          return false;
        }
        return song.title.toLowerCase().includes(lowerTerm);
      });

      const filteredAlbums = albums.filter((album) => {
        if (!album || !album.title) {
          console.error("🚨 ERREUR: Cet album n'a pas de titre :", album);
          return false;
        }
        return album.title.toLowerCase().includes(lowerTerm);
      });

      const filteredArtist = artists.filter((artist) => {
        if (!artist || !artist.firstName) {
          console.error(
            "🚨 ERREUR: Cet artiste n'a pas de firstName :",
            artist
          );
          return false;
        }
        return artist.firstName.toLowerCase().includes(lowerTerm);
      });

      return {
        songs: filteredSongs,
        albums: filteredAlbums,
        artists: filteredArtist,
      };
    }
  );
export const selectArtistData = (userId: string) =>
  createSelector(
    selectAllSongs,
    selectAllAlbums,
    selectAllArtists,
    (songs, albums, artists) => {
      // On retrouve l'artiste via son userId
      const artist = artists.find((a) => a.userId === userId) || null;

      // On filtre les musiques et albums par userId
      const artistSongs = songs.filter((song) => song.artistId === userId);
      const artistAlbums = albums.filter((album) => album.artistId === userId);

      // Dernier album par date
      const lastAlbumCover = artistAlbums.length
        ? artistAlbums
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )[0].cover
        : null;

      return {
        artist, // ✅ infos de l’artiste (firstName, label, avatar…)
        songs: artistSongs,
        albums: artistAlbums,
        lastAlbumCover,
      };
    }
  );
