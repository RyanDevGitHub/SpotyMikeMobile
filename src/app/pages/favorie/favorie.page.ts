import { IFavorite } from './../../core/interfaces/favorites';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonCol,
  IonRow,
  IonImg,
} from '@ionic/angular/standalone';
import { PlaylistesOptionComponent } from 'src/app/shared/components/button/playlistes-option/playlistes-option.component';
import { LikeSongComponent } from 'src/app/shared/components/button/like-song/like-song.component';
import { ShareSongComponent } from 'src/app/shared/components/button/share-song/share-song.component';
import { ModalController } from '@ionic/angular/standalone';
import { PlaySongPage } from 'src/app/shared/modal/play-song/play-song.page';
import { SongOptionComponent } from 'src/app/shared/components/button/song-option/song-option.component';
import { HeaderCategoryComponent } from 'src/app/shared/components/headers/header-category/header-category.component';
import { filter, map, Observable, Subscription } from 'rxjs';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { selectFavoriteSongsByUser } from 'src/app/core/store/selector/song.selector';
import { ISong } from 'src/app/core/interfaces/song';
import { loadSongSuccess } from 'src/app/core/store/action/song.action';
import { selectUser } from 'src/app/core/store/selector/user.selector';
import { loadUser } from 'src/app/core/store/action/user.action';
import { selectAllSongs } from 'src/app/core/store/reducer/song.reducer';
import { loadFavorites } from 'src/app/core/store/action/favorites.actions';
import { selectSortedFavorites } from 'src/app/core/store/selector/favorites.selector';
import { toSignal } from '@angular/core/rxjs-interop';
import { IUser } from 'src/app/core/interfaces/user';
import { MusicContainerComponent } from 'src/app/shared/components/containers/music-container/music-container.component';
import { AlbumContainerComponent } from "src/app/shared/components/containers/album-container/album-container.component";

@Component({
  selector: 'app-favorie',
  templateUrl: './favorie.page.html',
  styleUrls: ['./favorie.page.scss'],
  standalone: true,
  imports: [
    IonImg,
    IonRow,
    IonCol,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    PlaylistesOptionComponent,
    LikeSongComponent,
    ShareSongComponent,
    PlaySongPage,
    SongOptionComponent,
    HeaderCategoryComponent,
    MusicContainerComponent,
    AlbumContainerComponent
],
})
export class FavoriePage implements OnDestroy {
  private modalCtrl = inject(ModalController);
  private store = inject(Store<AppState>);
  private storeUser = inject(Store<IUser[]>);
  public isModalOpen: boolean;
  private modalSubscription = inject(ModalStateService).modalOpen$.subscribe(
    (value) => (this.isModalOpen = value)
  );

  // ⚡ Utilisation de toSignal pour connecter l'observable NgRx au template
  public favoriteSongs = toSignal(
    this.store.select(selectSortedFavorites).pipe(map((f) => f.songs))
  );

  public favoriteAlbums = toSignal(
    this.store.select(selectSortedFavorites).pipe(map((f) => f.albums))
  );
  user$ = this.storeUser.select(selectUser);

  async openModal(song: ISong) {
    const modal = await this.modalCtrl.create({
      component: PlaySongPage,
      componentProps: { song },
    });
    await modal.present();
  }

  trackById(index: number, item: ISong) {
    return item.id;
  }

  ngOnDestroy() {
    this.modalSubscription.unsubscribe();
  }
}
