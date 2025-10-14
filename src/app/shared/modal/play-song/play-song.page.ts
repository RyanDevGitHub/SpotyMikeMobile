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
import { MinimizePlayerAudioService } from 'src/app/core/services/minimize-player-audio.service';
import { Subscription, take } from 'rxjs';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { ISong } from 'src/app/core/interfaces/song';
import { Store } from '@ngrx/store';
import { selectAllSongs } from 'src/app/core/store/selector/song.selector';
import { PlayerStateService } from 'src/app/core/services/player-state.service';
import { addLastSongUser } from 'src/app/core/store/action/user.action';
import { SongRepositoryService } from 'src/app/core/services/repositories/song-repository.service';

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
  isMini = false; // Indicateur pour le mode mini
  public isModalOpen: boolean;
  private modalSubscription: Subscription;
  @Input() music: ISong;
  constructor(
    private modalStateService: ModalStateService,
    private modalController: ModalController,
    private store: Store<ISong[]>,
    private playerState: PlayerStateService,
    private songRepositoryService: SongRepositoryService = inject(
      SongRepositoryService
    ),
    @Inject(MinimizePlayerAudioService)
    public minimizePlayerAudioService: MinimizePlayerAudioService
  ) {
    this.modalSubscription = modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value)
    );
  }

  ngOnInit() {
    addIcons({ searchOutline, personCircleOutline });
    console.log('Chanson reçue dans PlaySongPage:', this.music.id);
    this.store.dispatch(addLastSongUser({ songId: this.music.id }));
  }
  minimizePlayer() {
    // Sauvegarder la chanson en cours
    this.playerState.setCurrentSong(this.music);
    // Afficher le mini player
    this.playerState.setMiniPlayerVisible(true);
    // Fermer la modale
    this.modalController.dismiss();
  }
  ionViewWillEnter() {
    if (this.music) {
      this.songRepositoryService.incrementSongListeningCount(this.music);
    }
  }

  handleNextSong() {
    this.store
      .select(selectAllSongs)
      .pipe(take(1))
      .subscribe((songs) => {
        if (!songs.length) return;

        // Choisir une chanson aléatoire différente
        const otherSongs = songs.filter((s) => s.id !== this.music.id);
        const randomSong =
          otherSongs[Math.floor(Math.random() * otherSongs.length)];

        // Fermer modal actuelle
        this.modalController.dismiss().then(() => {
          // Ouvrir nouvelle modal
          this.modalController
            .create({
              component: PlaySongPage,
              componentProps: { music: randomSong },
            })
            .then((m) => m.present());
        });
      });
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }
}
