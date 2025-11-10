export enum PlayPageType {
  Album = 'album',
  Artist = 'artist',
  Playlist = 'playlist',
  Independently = 'independently',
  Favori = 'favori',
  TopSongs = 'top-songs',
  LastPlayed = 'last-played',
  GenrePop = 'genre-pop',
  GenreRock = 'genre-rock',
  GenreJazz = 'genre-jazz',
  GenreAll = 'genre-all',
  NewSongs = 'new-songs',
}
export interface PlayContext {
  type: PlayPageType;
  sourceId?: string | number;
}
