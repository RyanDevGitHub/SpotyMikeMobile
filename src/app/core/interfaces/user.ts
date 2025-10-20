import { FieldValue } from 'firebase/firestore/lite';
import { IPlaylist, IPlaylistRaw } from './../interfaces/playlistes';

export enum ERoleUser {
  User = 'user',
  Artist = 'artist',
}

export interface IUser {
  role: ERoleUser;
  avatar: string;
  token?: string;
  email: string;
  id: string;
  lastsplayeds: string[];
  firstName: string;
  lastName: string;
  password: string;
  tel?: string;
  sexe: string;
  favorites: IFavorite;
  artiste?: IArtist;
  playlists: IPlaylistRaw[];
  created_at: string;
}
export interface IToken {
  token: string;
}

export interface IArtist {
  id: string;
  userId: string;
  label: string;
  firstName: string;
  description: string;
  avatar: string;
  subscribers: string[];
}

export interface IUserDataBase {
  id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  tel?: string;
  sexe: string;
  // hasAlbum?: boolean;
  favorites: IFavorite;
  artiste?: IArtist;
  playlists: IPlaylistRaw[];
  lastsplayeds: string[];
  created_at: string;
  role: ERoleUser;
}
export interface IFavorite {
  songs: string[];
  albums: string[];
}

export interface IUserUpdateDataBase {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  tel?: string;
  sexe?: string;
  favorites?: IFavorite | FieldValue;
  artiste?: IArtist;
  playlists?: IPlaylistRaw[];
  lastsplayeds?: string[] | FieldValue;
  created_at?: string;
}
