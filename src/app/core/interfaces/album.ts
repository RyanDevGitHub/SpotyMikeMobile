import { ISong } from './song';
import { IArtist } from './user';

export interface IAlbumRaw {
  artistId: string;
  cover: string;
  createdAt: string;
  id: string;
  songs: ISong[];
  title: string;
}

export interface IAlbum {
  id: string;
  title: string;
  artistId: string;
  createdAt: Date; // conversion ISO string → Date
  songs: ISong[];
  cover: string;
}

export interface IAlbumFront {
  id: string;
  title: string;
  artistId: string;
  artistInfo: IArtist;
  createdAt: Date; // conversion ISO string → Date
  songs: ISong[];
  cover: string;
}

export interface IAlbumInfo {
  id: string;
  title: string;
  cover: string;
}
