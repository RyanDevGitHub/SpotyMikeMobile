import { HeaderCategoryComponent } from 'src/app/shared/components/headers/header-category/header-category.component';
import { SongOptionComponent } from '../../shared/components/button/song-option/song-option.component';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
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
  ModalController,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { PlaylistesOptionComponent } from 'src/app/shared/components/button/playlistes-option/playlistes-option.component';
import { LikeSongComponent } from 'src/app/shared/components/button/like-song/like-song.component';
import { ShareSongComponent } from 'src/app/shared/components/button/share-song/share-song.component';
import { IPlaylist } from 'src/app/core/interfaces/playlistes';
import { PlaySongPage } from 'src/app/shared/modal/play-song/play-song.page';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { selectUserPlaylists } from 'src/app/core/store/selector/user.selector';
import { loadUser } from 'src/app/core/store/action/user.action';
import { Router } from '@angular/router';
import { PlaylistContainerComponent } from "src/app/shared/components/containers/playlist-container/playlist-container.component";

@Component({
  selector: 'app-playlistes',
  templateUrl: './playlistes.page.html',
  styleUrls: ['./playlistes.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonImg,
    IonCol,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonRow,
    PlaylistesOptionComponent,
    LikeSongComponent,
    ShareSongComponent,
    IonTitle,
    SongOptionComponent,
    HeaderCategoryComponent,
    AsyncPipe,
    PlaylistContainerComponent
],
})
export class PlaylistesPage implements OnInit, OnDestroy {
  public isModalOpen = false;
  private modalSubscription: Subscription;
  private store = inject(Store<AppState>);
  private router = inject(Router);
  constructor(
    private modalCtrl: ModalController,
    private modalStateService: ModalStateService
  ) {
    this.modalSubscription = modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value)
    );
  }
  public listPlaylistes = this.store.select(selectUserPlaylists);

  ngOnInit() {
    console.log(this.isModalOpen);
    this.listPlaylistes.subscribe((playlists) => {
      console.log('Playlists depuis le store:', playlists);
    });
  }

  async openPlaylist(id:string) {
    this.router.navigate(['/home/playlist/' + id]);
  }
  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }
}
