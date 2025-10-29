import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { IPlaylist } from 'src/app/core/interfaces/playlistes';
import { HeaderCategoryComponent } from 'src/app/shared/components/headers/header-category/header-category.component';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { selectUserPlaylists } from 'src/app/core/store/selector/user.selector';
import { ISong } from 'src/app/core/interfaces/song';
import { MusicContainerVerticalComponent } from 'src/app/shared/components/containers/music-container-vertical/music-container-vertical.component';
import { MusicContainerComponent } from 'src/app/shared/components/containers/music-container/music-container.component';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    HeaderCategoryComponent,
    MusicContainerVerticalComponent,
    MusicContainerComponent,
  ],
})
export class PlaylistPage implements OnInit {
  playlistId: string | null;
  private store = inject(Store<AppState>);
  playlist: IPlaylist;
  public isModalOpen: boolean;
  private modalSubscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private modalStateService: ModalStateService,
  ) {
    this.modalSubscription = modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value),
    );
  }

  ngOnInit() {
    const playlistId = this.route.snapshot.paramMap.get('id');
    if (playlistId) {
      this.store.select(selectUserPlaylists).subscribe((playlists) => {
        this.playlist = playlists.find((p) => p.id === playlistId)!;
        console.log(this.playlist);
      });
    }
  }
}
