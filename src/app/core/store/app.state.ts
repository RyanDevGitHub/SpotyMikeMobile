import { AlbumsState } from './reducer/album.reducer';
import { ArtistsState } from './reducer/artist.reducer';
import { FavoritesState } from './reducer/favorite.reducer';
import { SongsState } from './reducer/song.reducer';
import { SortState } from './reducer/sort.reducer';
import { UserState } from './reducer/user.reducer';

export interface AppState {
  music: SongsState; // Assurez-vous que le type est correct
  user: UserState;
  favorites: FavoritesState;
  album: AlbumsState;
  artists: ArtistsState;
  sort: SortState;
}
