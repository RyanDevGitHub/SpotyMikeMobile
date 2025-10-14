import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { HeaderCategoryComponent } from 'src/app/shared/components/headers/header-category/header-category.component';
import { DisplayItemComponent } from 'src/app/shared/components/display-item/display-item.component';
import { IPlaylist, IPlaylistRaw } from 'src/app/core/interfaces/playlistes';
import { ISong } from 'src/app/core/interfaces/song';
import { Subscription } from 'rxjs';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { AppState } from '@capacitor/app';
import { Store } from '@ngrx/store';
import { selectSortedTopSongs, selectTopSongsByListeningCount } from 'src/app/core/store/selector/song.selector';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-top-songs',
  templateUrl: './top-songs.page.html',
  styleUrls: ['./top-songs.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    HeaderCategoryComponent,
    DisplayItemComponent,
  ],
})
export class TopSongsPage implements OnInit {
  public isModalOpen: boolean;
  private modalSubscription: Subscription;
  public listPlaylistes: IPlaylistRaw[] = [];
  store = inject(Store<AppState>);
  public listMusics = toSignal(this.store.select(selectSortedTopSongs));

  constructor(private modalStateService: ModalStateService) {
    this.modalSubscription = modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value)
    );
  }

  ngOnInit() {
    console.log('init last played component');
  }
}
