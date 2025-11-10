import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AppState } from '@capacitor/app';
import {
  IonContent,
  IonGrid,
  ModalController,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import {
  PlayContext,
  PlayPageType,
} from 'src/app/core/interfaces/play-page-type';
import { ISong } from 'src/app/core/interfaces/song';
import { IUser } from 'src/app/core/interfaces/user';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { selectSortedFavorites } from 'src/app/core/store/selector/favorites.selector';
import { selectUser } from 'src/app/core/store/selector/user.selector';
import { AlbumContainerComponent } from 'src/app/shared/components/containers/album-container/album-container.component';
import { MusicContainerComponent } from 'src/app/shared/components/containers/music-container/music-container.component';
import { HeaderCategoryComponent } from 'src/app/shared/components/headers/header-category/header-category.component';

@Component({
  selector: 'app-favori',
  templateUrl: './favori.page.html',
  styleUrls: ['./favori.page.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonContent,
    CommonModule,
    FormsModule,
    HeaderCategoryComponent,
    MusicContainerComponent,
    AlbumContainerComponent,
  ],
})
export class FavoriPage implements OnDestroy {
  private modalCtrl = inject(ModalController);
  private store = inject(Store<AppState>);
  private storeUser = inject(Store<IUser[]>);
  public isModalOpen: boolean;
  public pageType: PlayPageType = PlayPageType.Favori;
  playContext: PlayContext;
  private modalSubscription = inject(ModalStateService).modalOpen$.subscribe(
    (value) => (this.isModalOpen = value)
  );
  constructor(private modalStateService: ModalStateService) {
    this.playContext = { type: this.pageType };
  }
  // ⚡ Utilisation de toSignal pour connecter l'observable NgRx au template
  public favoriteSongs = toSignal(
    this.store.select(selectSortedFavorites).pipe(map((f) => f.songs))
  );

  public favoriteAlbums = toSignal(
    this.store.select(selectSortedFavorites).pipe(map((f) => f.albums))
  );
  user$ = this.storeUser.select(selectUser);

  trackById(index: number, item: ISong) {
    return item.id;
  }

  ngOnDestroy() {
    this.modalSubscription.unsubscribe();
  }
}
