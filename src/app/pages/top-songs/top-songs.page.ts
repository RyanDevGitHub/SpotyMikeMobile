import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  PlayContext,
  PlayPageType,
} from 'src/app/core/interfaces/play-page-type';
import { IPlaylistRaw } from 'src/app/core/interfaces/playlists';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { AppState } from 'src/app/core/store/app.state';
import { selectSortedTopSongs } from 'src/app/core/store/selector/song.selector';
import { DisplayItemComponent } from 'src/app/shared/components/display-item/display-item.component';
import { HeaderCategoryComponent } from 'src/app/shared/components/headers/header-category/header-category.component';

@Component({
  selector: 'app-top-songs',
  templateUrl: './top-songs.page.html',
  styleUrls: ['./top-songs.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    HeaderCategoryComponent,
    DisplayItemComponent,
  ],
})
export class TopSongsPage implements OnInit {
  public isModalOpen: boolean;
  private modalSubscription: Subscription;
  public listPlaylists: IPlaylistRaw[] = [];
  store = inject(Store<AppState>);
  pageType = PlayPageType.TopSongs;
  playContext: PlayContext;
  public listMusics = toSignal(this.store.select(selectSortedTopSongs));

  constructor(private modalStateService: ModalStateService) {
    this.modalSubscription = modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value)
    );
    this.playContext = { type: this.pageType };
  }

  ngOnInit() {
    console.log('init last played component');
  }
}
