import { SongGenre, PlaybackMode } from '../../../../core/interfaces/song';
import { addIcons } from 'ionicons';
import {
  IonButton,
  IonRange,
  IonIcon,
  IonGrid,
  IonCol,
  IonRow,
  IonLabel,
} from '@ionic/angular/standalone';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import {
  pauseOutline,
  playOutline,
  playSkipBack,
  playSkipBackOutline,
  playSkipForwardOutline,
  repeatOutline,
  shuffleOutline,
} from 'ionicons/icons';
import { ISong } from 'src/app/core/interfaces/song';

import { Subscription } from 'rxjs';
import { MusicServiceService } from 'src/app/core/services/music-service.service';
import { CapacitorMusicControls } from 'capacitor-music-controls-plugin';

@Component({
  selector: 'app-music-nav-bar',
  templateUrl: './music-nav-bar.component.html',
  standalone: true,
  styleUrls: ['./music-nav-bar.component.scss'],
  imports: [IonButton, IonRange, IonIcon, IonGrid, IonCol, IonRow, IonLabel],
})
export class MusicNavBarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isMini: boolean;
  @Input() music: ISong;
  @Output() nextSong = new EventEmitter<void>();

  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;

  buttonFillShuffle: string = '';
  buttonColorShuffle: string = '';
  buttonFillLoop: string = '';
  buttonColorLoop: string = '';
  buttonFillAfter: string = '';
  buttonColorAfter: string = '';
  buttonColorPrev: string = '';
  buttonFillPrev: string = '';

  private isPlayingSubscription: Subscription;
  private currentTimeSubscription: Subscription;

  currentPlaybackMode: PlaybackMode = PlaybackMode.Default;

  constructor(private audioService: MusicServiceService) {}

  async ngOnInit() {
    // Démarrer la lecture si aucune chanson n'est en cours
    if (!this.audioService.isPlayingNow() && this.music?.url) {
      // Utiliser loadAndPlay (asynchrone)
      await this.audioService.loadAndPlay(this.music);
    }
    this.isPlayingSubscription = this.audioService.isPlaying$.subscribe(
      (isPlaying) => (this.isPlaying = isPlaying),
    );

    this.currentTimeSubscription = this.audioService
      .getCurrentTime$()
      .subscribe((time) => (this.currentTime = time));

    // Récupérer la durée de la chanson
    this.audioService.getDuration().then((d) => (this.duration = d));
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['music'] && changes['music'].currentValue) {
      // 👈 Utiliser loadAndPlay, car l'API du service a changé
      await this.audioService.loadAndPlay(this.music);
      this.currentPlaybackMode = PlaybackMode.Default;
      this.resetButtons();
    }
  }
  ngOnDestroy() {
    this.isPlayingSubscription.unsubscribe();
    this.currentTimeSubscription.unsubscribe();
  }

  togglePlayPause() {
    if (this.isPlaying) this.pauseMusic();
    else this.playMusic();
  }

  async playMusic() {
    if (!this.audioService.isPlayingNow()) {
      await this.audioService.loadAndPlay(this.music);
    } else {
      await this.audioService.resume(); // Utilisation de la nouvelle méthode resume
    }
  }

  async pauseMusic() {
    if (this.audioService.isPlayingNow()) {
      await this.audioService.pause();
    }
  }

  playPrevMusic() {
    this.nextSong.emit();
  }

  playAfterMusic() {
    this.nextSong.emit();
  }

  async seekMusic(event: any) {
    const newTime = event.detail.value;
    await this.audioService.seek(newTime); // Utilisation de la méthode asynchrone
  }

  randomPlaylist() {
    if (this.currentPlaybackMode !== PlaybackMode.Shuffle) {
      this.currentPlaybackMode = PlaybackMode.Shuffle;
      this.buttonColorShuffle = 'success';
      this.buttonFillShuffle = 'solid';
    } else {
      this.currentPlaybackMode = PlaybackMode.Default;
      this.buttonColorShuffle = '';
      this.buttonFillShuffle = '';
    }
  }

  loopPlaylist() {
    if (this.currentPlaybackMode !== PlaybackMode.Loop) {
      this.currentPlaybackMode = PlaybackMode.Loop;
      this.buttonColorLoop = 'success';
      this.buttonFillLoop = 'solid';
    } else {
      this.currentPlaybackMode = PlaybackMode.Default;
      this.buttonColorLoop = '';
      this.buttonFillLoop = '';
    }
  }

  formatTime(time: number): string {
    if (!isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${this.pad(minutes)}:${this.pad(seconds)}`;
    }
    return '00:00';
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  private resetButtons() {
    this.buttonColorLoop = '';
    this.buttonFillLoop = '';
    this.buttonColorShuffle = '';
    this.buttonFillShuffle = '';
    this.buttonColorPrev = '';
    this.buttonFillPrev = '';
    this.buttonColorAfter = '';
    this.buttonFillAfter = '';
  }
}
