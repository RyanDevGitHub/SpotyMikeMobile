import { IAlbum, IAlbumInfo } from './album';
import { IArtistInfo } from './artist';
import { IArtist, IUser } from './user';

export interface ISong {
  cover: string;
  title: string;
  albumInfo?: IAlbumInfo;
  artistInfo: IArtistInfo | null;
  artistId: string;
  duration: string;
  url: string;
  id: string;
  featuring: string[];
  listeningCount: string;
  lyrics: string;
  createAt: Date;
  genre: SongGenre;
}

export interface ISongRaw {
  id: string; // id de la chanson
  title: string; // titre de la chanson
  cover: string; // url de la cover
  duration: string; // durée en secondes sous forme de string
  url: string; // url du mp3
  lyrics: string; // paroles
  listeningCount: string; // compteur d'écoutes (stocké en string dans Firestore)
  genre: string; // genre musical (Electro, Rock, etc.)
  featuring: string[]; // tableau d'artistes en featuring
  artistId: string; // id de l'artiste principal
}

export enum PlaybackMode {
  Default = 'default',
  Shuffle = 'shuffle',
  Loop = 'loop',
}

export enum SongGenre {
  Pop = 'pop',
  Rock = 'rock',
  Jazz = 'jazz',
}
