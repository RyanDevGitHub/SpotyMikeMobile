import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonRow,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { select, Store } from '@ngrx/store';
import { map, Observable, Subscription, take } from 'rxjs';
import {
  PlayContext,
  PlayPageType,
} from 'src/app/core/interfaces/play-page-type';
import { ISong } from 'src/app/core/interfaces/song';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { MusicServiceService } from 'src/app/core/services/music-service.service';
import { PlayerStateService } from 'src/app/core/services/player-state.service';
import { selectSongsByAlbumId } from 'src/app/core/store/selector/album.selector';
import { selectSongsByArtistId } from 'src/app/core/store/selector/artist.selector';
import { selectSortedFavorites } from 'src/app/core/store/selector/favorites.selector';
import {
  selectFilteredAndSortedSongsByGenre,
  selectRecentSongs,
  selectSongsByPlaylistId,
  selectSortedLastPlayedSongs,
  selectSortedTopSongs,
} from 'src/app/core/store/selector/song.selector';

import { BackButtonComponent } from '../../components/button/back-button/back-button.component';
import { LikeSongComponent } from '../../components/button/like-song/like-song.component';
import { ShareSongComponent } from '../../components/button/share-song/share-song.component';
import { SongOptionComponent } from '../../components/button/song-option/song-option.component';
import { LyricsBoxComponent } from '../../components/playerComponents/lyrics-box/lyrics-box.component';
import { MusicNavBarComponent } from '../../components/playerComponents/music-nav-bar/music-nav-bar.component';
import { AppState } from './../../../core/store/app.state';

@Component({
  selector: 'app-play-song',
  templateUrl: './play-song.page.html',
  styleUrls: ['./play-song.page.scss'],
  standalone: true,
  imports: [
    IonImg,
    IonButtons,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    BackButtonComponent,
    SongOptionComponent,
    LikeSongComponent,
    ShareSongComponent,
    MusicNavBarComponent,
    LyricsBoxComponent,
  ],
})
export class PlaySongPage implements OnDestroy, OnInit {
  @Input() music: ISong;
  @Input() openWith: PlayContext;
  currentTrackList: ISong[] = [];
  isMini = false;
  private modalSubscription: Subscription;
  public isModalOpen: boolean;
  private store = inject(Store<AppState>);
  private navigationSubscription: Subscription;
  constructor(
    private modalStateService: ModalStateService,
    private modalController: ModalController,
    private playerState: PlayerStateService,
    private audioService: MusicServiceService
  ) {
    console.log('[PlaySongPage] Constructeur lancé.');
    this.modalSubscription = this.modalStateService.modalOpen$.subscribe(
      (val) => (this.isMini = !val)
    ); // NOTE: Vous avez deux fois la même subscription. La seconde écrasera la première si elles ont le même nom.
    // J'ai corrigé l'usage de modalSubscription ici :
    this.modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value)
    );
  }

  ngOnInit() {
    this.navigationSubscription =
      this.audioService.navigationRequest$.subscribe((direction) => {
        console.log(
          `Piste terminée. La page PlaySong Page reçoit la commande: ${direction}`
        );

        // Appel à votre logique de navigation existante
        this.handleNavigation(direction);
      });
    console.log('🎼 [PlaySongPage Init] Modal initialisée.');
    console.log(
      '🎼 [PlaySongPage Init] Contexte de lecture (openWith):',
      this.openWith
    );
    console.log(
      '🎼 [PlaySongPage Init] Morceau initial (music):',
      this.music?.title
    );
  }

  minimizePlayer() {
    console.log('[PlaySongPage Action] Minimisation du lecteur demandée.');
    this.playerState.setMiniPlayer(true);
    this.modalController.dismiss();
  }

  handleNavigation(direction: 'next' | 'prev' | 'shuffle') {
    console.log(`⏩ [Navigation Start] Tentative de navigation: ${direction}`);

    if (!this.openWith || !this.music) {
      console.warn(
        '⏩ [Navigation Fail] Contexte (openWith) ou Morceau (music) manquant. Arrêt.'
      );
      return;
    }

    console.log(
      `⏩ [Navigation Context] Type: ${this.openWith.type}, Source ID: ${
        this.openWith.sourceId || 'N/A'
      }`
    ); // 1. Récupérer la liste de lecture actuelle depuis le Store
    this.getTrackListForContext(this.openWith)
      .pipe(
        take(1) // Prend la valeur actuelle et se désabonne
      )
      .subscribe((trackList) => {
        console.log(
          `⏩ [Navigation List] Liste récupérée. Nombre de morceaux: ${trackList.length}`
        );

        if (!trackList || trackList.length === 0) {
          console.error(
            '⏩ [Navigation Fail] Liste de lecture vide ou non trouvée.'
          );
          return;
        }

        this.currentTrackList = trackList; // Stocke la liste // Trouver l'index du morceau en cours de lecture
        const currentIndex = this.currentTrackList.findIndex(
          (t) => t.id === this.music.id
        );
        let newIndex: number;
        if (direction === 'shuffle') {
          // 💡 LOGIQUE SHUFFLE : Sélectionne un index aléatoire différent du morceau actuel
          let randomIndex: number;
          do {
            randomIndex = Math.floor(
              Math.random() * this.currentTrackList.length
            );
          } while (
            randomIndex === currentIndex &&
            this.currentTrackList.length > 1
          );

          newIndex = randomIndex;
          console.log(
            `🎲 [Navigation Shuffle] Sélection d'un nouvel index aléatoire: ${newIndex}`
          );
        } else {
          console.log(
            `⏩ [Navigation Index] Morceau actuel: ${this.music.title}. Index trouvé: ${currentIndex}`
          );

          if (currentIndex === -1) {
            console.error(
              '⏩ [Navigation Fail] Morceau actuel introuvable dans la liste de lecture. ID:',
              this.music.id
            );
            return;
          }
          let boundaryAction = ''; // Log pour la fin/début de liste

          if (direction === 'next') {
            newIndex = currentIndex + 1;
            if (newIndex >= this.currentTrackList.length) {
              newIndex = 0; // Boucle par défaut
              boundaryAction = 'Boucle à la première chanson.';
            }
          } else {
            // 'prev'
            newIndex = currentIndex - 1;
            if (newIndex < 0) {
              newIndex = this.currentTrackList.length - 1; // Boucle par défaut
              boundaryAction = 'Boucle à la dernière chanson.';
            }
          }

          if (boundaryAction) {
            console.log(
              `⏩ [Navigation Boundary] Limite de liste atteinte: ${boundaryAction}`
            );
          } // Si l'index est valide, lance la lecture du nouveau morceau
        }
        const nextOrPrevSong = this.currentTrackList[newIndex];
        if (nextOrPrevSong) {
          console.log(
            `✅ [Navigation Success] Nouveau morceau à l'index ${newIndex}: ${nextOrPrevSong.title}`
          ); // ⚠️ Appel la fonction du service audio pour changer le morceau
          this.music = nextOrPrevSong;
          this.audioService.loadAndPlay(nextOrPrevSong);
        } else {
          console.error(
            '⏩ [Navigation Fail] Morceau calculé (nextOrPrevSong) est undefined.'
          );
        }
      });
  }

  // ... (Reste de getTrackListForContext non modifié) ...

  getTrackListForContext(context: PlayContext): Observable<ISong[]> {
    // Fonction utilitaire pour retourner un Observable vide
    const emptyObservable = new Observable<ISong[]>((subscriber) => {
      subscriber.next([]);
      subscriber.complete();
    });

    switch (context.type) {
      // --- CAS AVEC TRI (Ils utilisent le SortState) ---

      case PlayPageType.Favori:
        // 💡 UTILISE LE SÉLECTEUR TRIÉ ET N'EXTRAIT QUE LES CHANSONS
        return this.store.pipe(
          select(selectSortedFavorites),
          map((favorites) => favorites.songs)
        );

      case PlayPageType.TopSongs:
        // 💡 UTILISE LE SÉLECTEUR TRIÉ
        return this.store.pipe(select(selectSortedTopSongs));

      case PlayPageType.LastPlayed:
        // 💡 UTILISE LE SÉLECTEUR TRIÉ
        return this.store.pipe(select(selectSortedLastPlayedSongs));

      case PlayPageType.GenrePop:
        // 💡 UTILISE LE SÉLECTEUR FILTRÉ ET TRIÉ
        return this.store.pipe(
          select(selectFilteredAndSortedSongsByGenre('Pop'))
        );

      case PlayPageType.GenreRock:
        // 💡 UTILISE LE SÉLECTEUR FILTRÉ ET TRIÉ
        return this.store.pipe(
          select(selectFilteredAndSortedSongsByGenre('Rock'))
        );

      case PlayPageType.GenreJazz:
        // 💡 UTILISE LE SÉLECTEUR FILTRÉ ET TRIÉ
        return this.store.pipe(
          select(selectFilteredAndSortedSongsByGenre('Jazz'))
        );

      case PlayPageType.GenreAll:
        // 💡 UTILISE LE SÉLECTEUR FILTRÉ ET TRIÉ
        return this.store.pipe(
          select(selectFilteredAndSortedSongsByGenre('All'))
        );

      case PlayPageType.NewSongs:
        // ⚠️ On utilise ici selectRecentSongs, qui trie par date de création, mais PAS par SortState.
        // Si vous avez un sélecteur trié par SortState pour les NewSongs, remplacez-le.
        return this.store.pipe(select(selectRecentSongs));

      // --- CAS SANS TRI (Utilisent les sélecteurs normaux par ID) ---

      case PlayPageType.Playlist:
      case PlayPageType.Album:
      case PlayPageType.Artist:
        if (context.sourceId) {
          const selector =
            context.type === PlayPageType.Playlist
              ? selectSongsByPlaylistId(context.sourceId as string)
              : context.type === PlayPageType.Album
              ? selectSongsByAlbumId(context.sourceId as string)
              : selectSongsByArtistId(context.sourceId as string);

          return this.store.pipe(select(selector));
        }
        break;

      // --- Cas Spéciaux ---

      case PlayPageType.Independently:
        if (this.music) {
          return new Observable<ISong[]>((subscriber) => {
            subscriber.next([this.music]);
            subscriber.complete();
          });
        }
        break;

      default:
        console.warn(
          `[TrackList Select] PlayPageType non géré ou inconnu: ${context.type}`
        );
        return emptyObservable;
    }

    return emptyObservable;
  }

  ngOnDestroy() {
    this.modalSubscription.unsubscribe();
    this.navigationSubscription?.unsubscribe();
    console.log(
      '❌ [PlaySongPage Destroy] PlaySongPage détruit, arrêt de la musique.'
    );
    this.audioService.destroy();
  }
}
