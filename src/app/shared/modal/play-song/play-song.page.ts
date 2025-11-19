import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
import { Store } from '@ngrx/store';
import { Subscription, take } from 'rxjs';
import { PlayContext } from 'src/app/core/interfaces/play-page-type';
import { ISong } from 'src/app/core/interfaces/song';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { MusicServiceService } from 'src/app/core/services/music-service.service';
import { PlayerStateService } from 'src/app/core/services/player-state.service';
import { addLastSongUser } from 'src/app/core/store/action/user.action';

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
  private modalSubscription: Subscription;
  public isModalOpen: boolean;
  private store = inject(Store<AppState>);
  private navigationSubscription: Subscription;
  private currentSongSubscription: Subscription;
  private cdRef = inject(ChangeDetectorRef);
  constructor(
    private modalStateService: ModalStateService,
    private modalController: ModalController,
    private playerState: PlayerStateService,
    private audioService: MusicServiceService
  ) {
    this.modalSubscription = modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value)
    );
  }

  ngOnInit() {
    console.log(this.openWith);
    if (this.playerState.getCurrentSong()) {
      console.log(this.playerState.getCurrentSong()?.id, this.music.id);
      if (this.music.id != this.playerState.getCurrentSong()?.id) {
        this.audioService.loadAndPlay(this.music);
        this.playerState.setCurrentSong(this.music);
      }
    } else if (!this.audioService.isAudioActiveNow()) {
      this.audioService.loadAndPlay(this.music);
      this.playerState.setCurrentSong(this.music);
    }

    // 🆕 1. S'abonner à l'état actuel de la chanson (PlayerStateService)
    this.currentSongSubscription = this.playerState.currentSong$.subscribe(
      (song) => {
        if (song) {
          // Mettre à jour l'Input/Propriété locale 'music' avec la chanson actuellement jouée.
          // Cela met à jour le Template (Cover, Titre) et l'Input de MusicNavBarComponent.
          this.music = song;
          console.log(
            `[PlaySongPage UI] Chanson de l'UI mise à jour vers: ${song.title}`
          );
          this.cdRef.detectChanges();
        }
      }
    );

    // 2. Logique de chargement de la liste (inchangée)
    this.playerState
      .getTrackListForContext(this.openWith, this.music)
      .pipe(take(1))
      .subscribe((trackList) => {
        this.playerState.setTrackList(trackList, this.openWith);

        // 🛑 CRUCIAL : Définir la chanson initiale dans l'état global.
        // C'est ce qui déclenche l'abonnement ci-dessus pour la première fois.

        console.log(
          `[PlaySongPage Init] Liste de ${trackList.length} morceaux transférée au PlayerState.`
        );
      });

    // 3. Abonnement à la fin de piste (inchangé)
    this.navigationSubscription =
      this.audioService.navigationRequest$.subscribe((direction) => {
        console.log(
          `Piste terminée. Délégation de la commande ${direction} au PlayerState.`
        );
        this.playerState.navigate(direction);
      });

    console.log('🎼 [PlaySongPage Init] Modal initialisée.');
    this.store.dispatch(addLastSongUser({ songId: this.music.id }));
  }

  minimizePlayer() {
    console.log('[PlaySongPage Action] Minimisation du lecteur demandée.');
    this.playerState.setCurrentSong(this.music);
    this.playerState.setMiniPlayer(true);
    this.modalController.dismiss();
  }

  handleNavigationDelegated(direction: 'next' | 'prev' | 'shuffle') {
    // ✅ Le parent reçoit l'événement de l'enfant et le délègue au service d'état.
    this.playerState.navigate(direction);
  }
  // ... (Reste de getTrackListForContext non modifié) ...

  ngOnDestroy() {
    this.modalSubscription.unsubscribe();
    this.navigationSubscription?.unsubscribe();
    this.currentSongSubscription?.unsubscribe();
    // console.log(
    //   '❌ [PlaySongPage Destroy] PlaySongPage détruit, arrêt de la musique.'
    // );
    // this.audioService.destroy();
  }
}
