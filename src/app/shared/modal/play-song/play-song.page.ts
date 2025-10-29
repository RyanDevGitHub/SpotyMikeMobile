import { LyricsBoxComponent } from '../../components/playerComponents/lyrics-box/lyrics-box.component';
import { MusicNavBarComponent } from '../../components/playerComponents/music-nav-bar/music-nav-bar.component';
import { ShareSongComponent } from '../../components/button/share-song/share-song.component';
import { LikeSongComponent } from '../../components/button/like-song/like-song.component';
import { SongOptionComponent } from '../../components/button/song-option/song-option.component';
import {
  Component,
  inject,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonButtons,
  IonBackButton,
  IonImg,
  IonModal,
  ModalController,
} from '@ionic/angular/standalone';
import { personCircleOutline, searchOutline } from 'ionicons/icons';
import { SearchButtonComponent } from 'src/app/shared/components/button/search-button/search-button.component';
import { BackButtonComponent } from '../../components/button/back-button/back-button.component';
import { MinimizePlayerAudioComponent } from '../../components/playerComponents/minimize-player-audio/minimize-player-audio.component';
import { Subscription, take } from 'rxjs';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { ISong } from 'src/app/core/interfaces/song';
import { Store } from '@ngrx/store';
import { PlayerStateService } from 'src/app/core/services/player-state.service';
import { MusicServiceService } from 'src/app/core/services/music-service.service';

@Component({
  selector: 'app-play-song',
  templateUrl: './play-song.page.html',
  styleUrls: ['./play-song.page.scss'],
  standalone: true,
  imports: [
    IonModal,
    IonImg,
    IonBackButton,
    IonButtons,
    IonButton,
    IonIcon,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    SearchButtonComponent,
    BackButtonComponent,
    SongOptionComponent,
    LikeSongComponent,
    ShareSongComponent,
    MusicNavBarComponent,
    LyricsBoxComponent,
    IonModal,
    MinimizePlayerAudioComponent,
  ],
})
export class PlaySongPage implements OnInit, OnDestroy {
  @Input() music: ISong;
  isMini = false;
  private modalSubscription: Subscription;
  public isModalOpen: boolean;

  constructor(
    private modalStateService: ModalStateService,
    private modalController: ModalController,
    private playerState: PlayerStateService,
    private audioService: MusicServiceService,
  ) {
    this.modalSubscription = this.modalStateService.modalOpen$.subscribe(
      (val) => (this.isMini = !val),
    );
  }

  ngOnInit() {
    this.playerState.setCurrentSong(this.music);

    this.audioService.loadAndPlay(this.music);
  }

  minimizePlayer() {
    this.playerState.setMiniPlayer(true);
    this.modalController.dismiss();
  }

  handleNextSong() {
    // logique existante pour sélectionner chanson suivante
  }

  ngOnDestroy() {
    this.modalSubscription.unsubscribe();
  }
}
