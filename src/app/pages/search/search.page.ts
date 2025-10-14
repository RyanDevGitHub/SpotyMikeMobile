import { AppState } from './../../core/store/app.state';
import { Store } from '@ngrx/store';
import { Component, OnInit, inject } from '@angular/core';
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
  IonText,
} from '@ionic/angular/standalone';
import { ResearchComponent } from 'src/app/shared/components/research/research.component';
import { IPlaylist, IPlaylistRaw } from 'src/app/core/interfaces/playlistes';
import { PlaylistContainerComponent } from 'src/app/shared/components/containers/playlist-container/playlist-container.component';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { ISong } from 'src/app/core/interfaces/song';
import { MusicContainerComponent } from 'src/app/shared/components/containers/music-container/music-container.component';
import { IArtist } from 'src/app/core/interfaces/user';
import { IArtistContainer } from 'src/app/core/interfaces/artist';
import { ArtistContainerComponent } from 'src/app/shared/components/containers/artist-container/artist-container.component';
import { selectSongsBySearchTerm } from 'src/app/core/store/selector/song.selector';
import { selectSearchResults } from 'src/app/core/store/selector/cross.selector';
import { IAlbum } from 'src/app/core/interfaces/album';
import { AlbumContainerComponent } from 'src/app/shared/components/containers/album-container/album-container.component';
import { ArtistPagePage } from '../artist-page/artist-page.page';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [
    IonText,
    IonRow,
    IonCol,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ResearchComponent,
    PlaylistContainerComponent,
    MusicContainerComponent,
    ArtistContainerComponent,
    AlbumContainerComponent,
    ArtistPagePage,
  ],
})
export class SearchPage implements OnInit {
  public artistLists: IArtistContainer[] = [];
  public listPlaylistes: IPlaylistRaw[] = [];
  public isModalOpen: boolean;

  private modalSubscription: any;
  private searchTerm$ = new Subject<string>();

  public songs$: Observable<ISong[]>;
  public albums$: Observable<IAlbum[]>;
  public artists$: Observable<IArtist[]>;
  store = inject(Store<AppState>);

  constructor(private modalStateService: ModalStateService) {
    this.modalSubscription = modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value)
    );
  }

  ngOnInit() {
    console.log('init search page');

    // Définir les observables filtrés
    this.songs$ = this.searchTerm$.pipe(
      debounceTime(300), // Attend 300ms entre chaque frappe
      distinctUntilChanged(), // Évite de refaire la recherche si le terme n’a pas changé
      switchMap((term) =>
        this.store
          .select(selectSearchResults(term))
          .pipe(map((results) => results.songs || []))
      )
    );

    this.albums$ = this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) =>
        this.store
          .select(selectSearchResults(term))
          .pipe(map((results) => results.albums || []))
      )
    );

    this.artists$ = this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) =>
        this.store
          .select(selectSearchResults(term))
          .pipe(map((results) => results.artists || []))
      )
    );
  }

  onSearchTermChange(term: string) {
    // console.log('[DEBUG] search.page: Search term emitted:', term);
    this.searchTerm$.next(term); // On émet la valeur dans le flux
  }
}
