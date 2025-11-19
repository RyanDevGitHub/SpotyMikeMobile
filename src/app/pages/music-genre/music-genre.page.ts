import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@capacitor/app';
import { IonContent, IonGrid } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  PlayContext,
  PlayPageType,
} from 'src/app/core/interfaces/play-page-type';
import { ISong, SongGenre } from 'src/app/core/interfaces/song';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { selectFilteredAndSortedSongsByGenre } from 'src/app/core/store/selector/song.selector';
import { MusicContainerComponent } from 'src/app/shared/components/containers/music-container/music-container.component';
import { HeaderCategoryComponent } from 'src/app/shared/components/headers/header-category/header-category.component';

@Component({
  selector: 'app-music-genre',
  templateUrl: './music-genre.page.html',
  styleUrls: ['./music-genre.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    HeaderCategoryComponent,
    IonGrid,
    MusicContainerComponent,
  ],
})
export class MusicGenrePage implements OnInit, OnDestroy {
  genre: SongGenre;
  // route = inject(ActivatedRoute)
  public isModalOpen: boolean;
  private modalSubscription: Subscription;
  store = inject(Store<AppState>);
  songs: ISong[] = [];
  pageType: PlayPageType;
  playContext: PlayContext;
  GenreMapping: { [key: string]: PlayPageType } = {
    pop: PlayPageType.GenrePop,
    rock: PlayPageType.GenreRock,
    jazz: PlayPageType.GenreJazz,
    all: PlayPageType.GenreAll,
  };
  constructor(
    private route: ActivatedRoute,
    private modalStateService: ModalStateService
  ) {
    this.modalSubscription = this.modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value)
    );
    this.playContext = { type: this.pageType };
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.genre = params['genre'];
    });
    this.pageType = this.GenreMapping[this.genre];

    this.store
      .select(selectFilteredAndSortedSongsByGenre(this.genre))
      .subscribe({
        next: (songs) => {
          this.songs = songs; // Doit être un tableau
        },
        error: (err) => {
          console.error('[DEBUG] Error in subscription:', err);
        },
      });
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }
}
