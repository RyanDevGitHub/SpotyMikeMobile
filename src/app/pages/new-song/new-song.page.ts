import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppState } from '@capacitor/app';
import { IonContent } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  PlayContext,
  PlayPageType,
} from 'src/app/core/interfaces/play-page-type';
import { IPlaylistRaw } from 'src/app/core/interfaces/playlists';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { selectRecentSongs } from 'src/app/core/store/selector/song.selector';
import { DisplayItemComponent } from 'src/app/shared/components/display-item/display-item.component';
import { HeaderCategoryComponent } from 'src/app/shared/components/headers/header-category/header-category.component';

import { ISong } from '../../core/interfaces/song';

@Component({
  selector: 'app-new-song',
  templateUrl: './new-song.page.html',
  styleUrls: ['./new-song.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    HeaderCategoryComponent,
    DisplayItemComponent,
  ],
})
export class NewSongPage implements OnInit {
  public listPlaylists: IPlaylistRaw[] = [];
  pageType = PlayPageType.NewSongs;
  playContext: PlayContext;
  public isModalOpen: boolean;
  private modalSubscription: Subscription;
  store = inject(Store<AppState>);
  songs: ISong[] = [];
  constructor(private modalStateService: ModalStateService) {
    this.modalSubscription = modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value)
    );
    this.playContext = { type: this.pageType };
  }

  ngOnInit() {
    // this.store.dispatch(loadSong());

    this.store.select(selectRecentSongs).subscribe({
      next: (songs) => {
        // console.log('[DEBUG] Recent Songs in subscription:', songs);
        this.songs = songs; // Doit être un tableau
      },
      error: (err) => {
        console.error('[DEBUG] Error in subscription:', err);
      },
    });
  }
}
