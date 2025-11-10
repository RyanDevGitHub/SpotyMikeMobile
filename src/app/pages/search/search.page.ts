import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { IAlbum } from 'src/app/core/interfaces/album';
import { IArtistContainer } from 'src/app/core/interfaces/artist';
import {
  PlayContext,
  PlayPageType,
} from 'src/app/core/interfaces/play-page-type';
import { IPlaylistRaw } from 'src/app/core/interfaces/playlists';
import { ISong } from 'src/app/core/interfaces/song';
import { IArtist } from 'src/app/core/interfaces/user';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { selectSearchResults } from 'src/app/core/store/selector/cross.selector';
import { AlbumContainerComponent } from 'src/app/shared/components/containers/album-container/album-container.component';
import { ArtistContainerComponent } from 'src/app/shared/components/containers/artist-container/artist-container.component';
import { MusicContainerComponent } from 'src/app/shared/components/containers/music-container/music-container.component';
import { PlaylistContainerComponent } from 'src/app/shared/components/containers/playlist-container/playlist-container.component';
import { ResearchComponent } from 'src/app/shared/components/research/research.component';

import { AppState } from './../../core/store/app.state';

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
    CommonModule,
    FormsModule,
    ResearchComponent,
    PlaylistContainerComponent,
    MusicContainerComponent,
    ArtistContainerComponent,
    AlbumContainerComponent,
  ],
})
export class SearchPage implements OnInit {
  public artistLists: IArtistContainer[] = [];
  public listPlaylists: IPlaylistRaw[] = [];
  public isModalOpen: boolean;
  public pageType = PlayPageType.Independently;
  public playContext: PlayContext;
  private modalSubscription: Subscription;
  private searchTerm$ = new Subject<string>();

  public songs$: Observable<ISong[]>;
  public albums$: Observable<IAlbum[]>;
  public artists$: Observable<IArtist[]>;
  store = inject(Store<AppState>);

  constructor(private modalStateService: ModalStateService) {
    this.modalSubscription = modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value)
    );
    this.playContext = { type: this.pageType };
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
