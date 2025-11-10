import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@capacitor/app';
import { IonContent } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  PlayContext,
  PlayPageType,
} from 'src/app/core/interfaces/play-page-type';
import { IPlaylist } from 'src/app/core/interfaces/playlists';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { selectUserPlaylists } from 'src/app/core/store/selector/user.selector';
import { MusicContainerComponent } from 'src/app/shared/components/containers/music-container/music-container.component';
import { HeaderCategoryComponent } from 'src/app/shared/components/headers/header-category/header-category.component';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    HeaderCategoryComponent,
    MusicContainerComponent,
  ],
})
export class PlaylistPage implements OnInit {
  playlistId: string | null;
  private store = inject(Store<AppState>);
  playlist: IPlaylist;
  public isModalOpen: boolean;
  public playContext: PlayContext;
  private modalSubscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private modalStateService: ModalStateService
  ) {
    this.modalSubscription = modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value)
    );
  }

  ngOnInit() {
    const playlistId = this.route.snapshot.paramMap.get('id');
    if (playlistId) {
      this.playContext = {
        type: PlayPageType.Playlist,
        sourceId: playlistId,
      };
      this.store.select(selectUserPlaylists).subscribe((playlists) => {
        this.playlist = playlists.find((p) => p.id === playlistId)!;
        console.log(this.playlist);
      });
    }
  }
}
