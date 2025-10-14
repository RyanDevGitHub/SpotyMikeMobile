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
import { FavorisService } from 'src/app/core/services/favoris.service';
import { IFavorite } from 'src/app/core/interfaces/favorites';
import { ISong } from 'src/app/core/interfaces/song';
import { AppState } from '@capacitor/app';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import {
  isFavorite,
  selectFavorites,
} from 'src/app/core/store/selector/favorites.selector';
import {
  addFavorite,
  removeFavorite,
} from 'src/app/core/store/action/favorites.actions';
import { selectAllSongs } from 'src/app/core/store/selector/song.selector';
import { Observable, take } from 'rxjs';
import { IUser } from 'src/app/core/interfaces/user';
import { selectUser } from 'src/app/core/store/selector/user.selector';

@Component({
  selector: 'app-like-song',
  templateUrl: './like-song.component.html',
  standalone: true,
  styleUrls: ['./like-song.component.scss'],
  imports: [IonButton, IonIcon],
})
export class LikeSongComponent implements OnInit {
  @Input() song!: IFavorite;

  public isLiked = false;
  private allSongs: ISong[] = [];
  private favorites: ISong[] = [];
  private user: IUser | null = null;

  constructor(
    private store: Store<ISong[]>,
    private storeUser: Store<IUser[]>,
    private favorisService: FavorisService
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

    // Récupérer les favoris depuis le store
    this.store.select(selectFavorites).subscribe((favorites) => {
      this.favorites = favorites;
      // Initialiser l'état du like
      this.isLiked = !!favorites.find((f) => f.id === this.song.id);

      console.log(`[SelectFavorites] : ${favorites}`);
    });
  }

  toggleLike(): void {
    if (!this.song) {
      console.error('[LikeSongComponent] song is undefined!');
      return;
    }

    const fullSong: ISong | undefined = this.allSongs.find(
      (s) => s.id === this.song.id
    );
    if (!fullSong) {
      console.error(`[LikeSongComponent] Song ID ${this.song.id} not found`);
      return;
    }

    if (this.isLiked) {
      this.favorisService.remove(this.song.id);
      if (this.user) {
        this.store.dispatch(
          removeFavorite({ userId: this.user.id, songId: fullSong.id })
        );
        this.isLiked = false; // ✅ mettre à jour directement
      }
    } else {
      this.favorisService.add(this.song);
      if (this.user && this.user.id) {
        this.store.dispatch(
          addFavorite({ song: fullSong, userId: this.user.id })
        );
        this.isLiked = true; // ✅ mettre à jour directement
      }
    }
  }
}
