import { User } from 'firebase/auth';
import { FieldValue } from 'firebase/firestore/lite';
import { IPlaylistRaw } from 'src/app/core/interfaces/playlists';

export enum ERoleUser {
  User = 'user',
  Artist = 'artist',
}
export interface ICover {
  src: string;
}

export interface IUser {
  role: ERoleUser;
  avatar: string;
  token?: string;
  email: string;
  id: string;
  lastsPlayed: string[];
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
  lastsPlayed: string[];
  created_at: string;
  role: ERoleUser;
}
export interface IFavorite {
  songs: string[];
  albums: string[];
}
interface IStsTokenManager {
  accessToken: string;
  expirationTime: number;
  refreshToken: string;
}

// Interface qui étend le type officiel User et ajoute la propriété manquante
export interface IFirebaseUser extends User {
  // Ajoutez la propriété stsTokenManager à notre version du User
  stsTokenManager?: IStsTokenManager; // On la met optionnelle au cas où
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
  lastsPlayed?: string[] | FieldValue;
  created_at?: string;
}
