import { ISong } from './song';

export interface IPlaylistRaw {
  title: string;
  id: string;
  songs: ISongRef[];
  cover: string;
}

// Front / sélecteur : playlist transformée avec les objets complets
export interface IPlaylist {
  title: string;
  id: string;
  songs: ISong[];
  cover: string;
}
export interface ISongRef {
  idSong: string;
}

export interface IPlaylistWithSelection extends IPlaylist {
  selected?: boolean; // 👈 juste pour l’UI
}
