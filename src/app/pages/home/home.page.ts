import {
  debugSelectAllSongs,
  selectLastSongsByUser,
  selectMusicState,
  selectTopSongsByListeningCount,
} from 'src/app/core/store/selector/song.selector';
import { loadSongsFromAlbums } from 'src/app/core/store/action/song.action';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { book, home } from 'ionicons/icons';
import { TopSongComponent } from 'src/app/shared/components/homeComponent/new-song/new-song.component';
import { MusicGenresComponent } from 'src/app/shared/components/homeComponent/music-genres/music-genres.component';
import { TopSongsComponent } from 'src/app/shared/components/homeComponent/top-songs/top-songs.component';
import { LastPlayedComponent } from 'src/app/shared/components/homeComponent/last-played/last-played.component';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { SearchBarComponent } from 'src/app/shared/components/homeComponent/search-bar/search-bar.component';
import { SongRepositoryService } from 'src/app/core/services/repositories/song-repository.service'; // Assurez-vous du bon chemin
import { ISong } from 'src/app/core/interfaces/song';
import {
  defaultIfEmpty,
  filter,
  map,
  Observable,
  Subscription,
  take,
} from 'rxjs';
import { AppState } from '@capacitor/app';
import { Store } from '@ngrx/store';
import {
  adapter,
  selectAllSongs,
  SongsState,
} from 'src/app/core/store/reducer/song.reducer';
import { loadUser } from 'src/app/core/store/action/user.action';
import { IUser } from 'src/app/core/interfaces/user';
import { selectUser } from 'src/app/core/store/selector/user.selector';
import { loadAlbums } from 'src/app/core/store/action/album.acton';
import { loadArtists } from 'src/app/core/store/action/artist.action';
import * as MusicControls from 'capacitor-music-controls-plugin';
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
    selectTopSongsByListeningCount,
  );
  lastPlayedSongs$: Observable<ISong[]> = this.store.select(
    selectLastSongsByUser,
  );
  firstTopSong$: Observable<ISong | undefined> = this.topsSongs$.pipe(
    map((songs) => (songs.length > 0 ? songs[0] : undefined)),
  );
  user: IUser | null;
  constructor(private modalStateService: ModalStateService) {
    addIcons({ book, home });
    this.modalSubscription = modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value),
    );
  }

  ngOnInit() {
    this.store.dispatch(loadArtists());
    this.store.dispatch(loadUser());
    console.log('TEST MUSIC CONTROLS');
    console.log(MusicControls);
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }
}
