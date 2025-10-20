import { addIcons } from 'ionicons';
import {
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { heart, heartOutline } from 'ionicons/icons';

import { IFavorite } from 'src/app/core/interfaces/favorites';
import { ISong } from 'src/app/core/interfaces/song';
import { AppState } from '@capacitor/app';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import {
  isFavoriteSong,
  selectAllFavorites,
  selectFavoriteSongs,
} from 'src/app/core/store/selector/favorites.selector';
import {
  addFavoriteAlbum,
  addFavoriteSong,
  removeFavoriteAlbum,
  removeFavoriteSong,
} from 'src/app/core/store/action/favorites.actions';
import { selectAllSongs } from 'src/app/core/store/selector/song.selector';
import { Observable, take } from 'rxjs';
import { IUser } from 'src/app/core/interfaces/user';
import { selectUser } from 'src/app/core/store/selector/user.selector';
import { IAlbum } from 'src/app/core/interfaces/album';
import { selectAllAlbums } from 'src/app/core/store/selector/album.selector';
import { FavoritesService } from 'src/app/core/services/favoris.service';

@Component({
  selector: 'app-like-song',
  templateUrl: './like-song.component.html',
  standalone: true,
  styleUrls: ['./like-song.component.scss'],
  imports: [IonButton, IonIcon],
})
export class LikeSongComponent implements OnInit {
  @Input() song?: ISong;
  @Input() album?: IAlbum;

  public isLiked = false;
  private allSongs: ISong[] = [];
  private allAlbums: IAlbum[] = [];
  private favorites: { songs: ISong[]; albums: IAlbum[] } = {
    songs: [],
    albums: [],
  };
  private user: IUser | null = null;

  constructor(
    private store: Store<any>,
    private storeUser: Store<IUser[]>,
    private favorisService: FavoritesService
  ) {}

  ngOnInit(): void {
    addIcons({ heart, heartOutline });

    // Récupérer l'utilisateur depuis le store
    this.storeUser.select(selectUser).subscribe((user) => {
      this.user = user;
    });
    // Récupérer toutes les chansons depuis le store
    this.store.select(selectAllSongs).subscribe((songs) => {
      this.allSongs = songs;
    });

    // Récupérer tous les albums depuis le store
    this.store.select(selectAllAlbums).subscribe((albums) => {
      this.allAlbums = albums;
    });

    // Récupérer les favoris depuis le store
    this.store
      .select(selectAllFavorites)
      .subscribe((favorites: { songs: ISong[]; albums: IAlbum[] }) => {
        this.favorites = favorites;

        if (this.song) {
          this.isLiked = !!favorites.songs.find(
            (s: ISong) => s.id === this.song?.id
          );
        } else if (this.album) {
          this.isLiked = !!favorites.albums.find(
            (a: IAlbum) => a.id === this.album?.id
          );
        }
      });
  }

  toggleLike(): void {
    if (!this.user) return;

    if (this.song) {
      this.handleSongLike();
    } else if (this.album) {
      this.handleAlbumLike();
    }
  }

  private handleSongLike(): void {
    if (!this.song || !this.user) return;

    const fullSong = this.allSongs.find((s) => s.id === this.song?.id);
    if (!fullSong) return;

    if (this.isLiked) {
      this.store.dispatch(
        removeFavoriteSong({ userId: this.user.id, songId: fullSong.id })
      );
    } else {
      this.store.dispatch(
        addFavoriteSong({ song: fullSong, userId: this.user.id })
      );
    }
    this.isLiked = !this.isLiked;
  }

  private handleAlbumLike(): void {
    if (!this.album || !this.user) return;

    const fullAlbum = this.allAlbums.find((a) => a.id === this.album?.id);
    if (!fullAlbum) return;

    if (this.isLiked) {
      this.store.dispatch(
        removeFavoriteAlbum({ userId: this.user.id, albumId: fullAlbum.id })
      );
    } else {
      this.store.dispatch(
        addFavoriteAlbum({ album: fullAlbum, userId: this.user.id })
      );
    }
    this.isLiked = !this.isLiked;
  }
}
