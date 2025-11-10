import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppState } from '@capacitor/app';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import * as MusicControls from 'capacitor-music-controls-plugin';
import { addIcons } from 'ionicons';
import { book, home } from 'ionicons/icons';
import { map, Observable, Subscription } from 'rxjs';
import { ISong } from 'src/app/core/interfaces/song';
import { IUser } from 'src/app/core/interfaces/user';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { loadArtists } from 'src/app/core/store/action/artist.action';
import { loadUser } from 'src/app/core/store/action/user.action';
import {
  selectLastSongsByUser,
  selectTopSongsByListeningCount,
} from 'src/app/core/store/selector/song.selector';
import { LastPlayedComponent } from 'src/app/shared/components/homeComponent/last-played/last-played.component';
import { MusicGenresComponent } from 'src/app/shared/components/homeComponent/music-genres/music-genres.component';
import { TopSongComponent } from 'src/app/shared/components/homeComponent/new-song/new-song.component';
import { SearchBarComponent } from 'src/app/shared/components/homeComponent/search-bar/search-bar.component';
import { TopSongsComponent } from 'src/app/shared/components/homeComponent/top-songs/top-songs.component';
@Component({
  selector: 'app-home-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TopSongComponent,
    MusicGenresComponent,
    TopSongsComponent,
    LastPlayedComponent,
    SearchBarComponent,
    AsyncPipe,
  ],
})
export class HomePage implements OnInit, OnDestroy {
  store = inject(Store<AppState>);
  public isModalOpen: boolean;
  private modalSubscription: Subscription;

  topsSongs$: Observable<ISong[]> = this.store.select(
    selectTopSongsByListeningCount
  );
  lastPlayedSongs$: Observable<ISong[]> = this.store.select(
    selectLastSongsByUser
  );
  firstTopSong$: Observable<ISong | undefined> = this.topsSongs$.pipe(
    map((songs) => (songs.length > 0 ? songs[0] : undefined))
  );
  user: IUser | null;
  constructor(private modalStateService: ModalStateService) {
    addIcons({ book, home });
    this.modalSubscription = modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value)
    );
  }

  ngOnInit() {
    this.store.dispatch(loadArtists());
    this.store.dispatch(loadUser());
    console.log(MusicControls);
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }
}
