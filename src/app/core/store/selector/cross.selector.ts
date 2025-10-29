import { createSelector } from '@ngrx/store';
import { selectAllSongs } from './song.selector';
import { selectAllAlbums } from './album.selector';
import { ISong } from '../../interfaces/song';
import { IAlbum } from '../../interfaces/album';
import { selectAllArtists } from './artist.selector';
import { IArtist } from '../../interfaces/user';

export const selectSearchResults = (searchTerm: string) =>
  createSelector(
    selectAllSongs,
    selectAllAlbums,
    selectAllArtists,
    (songs: ISong[], albums: IAlbum[], artists: IArtist[]) => {
      const lowerTerm = searchTerm.toLowerCase();

      const filteredSongs = songs.filter((song) =>
        song.title.toLowerCase().includes(lowerTerm),
      );

      const filteredAlbums = albums.filter((album) =>
        album.title.toLowerCase().includes(lowerTerm),
      );
      const filteredArtist = artists.filter((artist) =>
        artist.firstName.toLowerCase().includes(lowerTerm),
      );

      return {
        songs: filteredSongs,
        albums: filteredAlbums,
        artists: filteredArtist,
      };
    },
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
                new Date(a.createdAt).getTime(),
            )[0].cover
        : null;

      return {
        artist, // ✅ infos de l’artiste (firstName, label, avatar…)
        songs: artistSongs,
        albums: artistAlbums,
        lastAlbumCover,
      };
    },
  );
