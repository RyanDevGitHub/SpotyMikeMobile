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

  private musicsList: ISong[] = [];

  isPlaying: boolean = true;
  currentTime: number = 0;
  duration: number = 0;
  buttonFillShuffle: string = '';
  buttonColorShuffle: string = '';
  buttonFillLoop: string = '';
  buttonColorLoop: string = '';
  buttonColorAfter: string = '';
  buttonColorPrev: string = '';
  buttonFillAfter: string = '';
  buttonFillPrev: string = '';
  private indexMusicList = 0;
  private isPlayingSubscription: Subscription;
  private currentTimeSubscription: Subscription;
  constructor(private audioService: MusicServiceService) {}

  currentPlaybackMode: PlaybackMode = PlaybackMode.Default;

  async ngOnInit() {
    addIcons({
      playOutline,
      playSkipBackOutline,
      playSkipForwardOutline,
      repeatOutline,
      shuffleOutline,
      pauseOutline,
    });
    if (!this.audioService.isPlaying()) {
      this.audioService.play(this.music.url);
    }
    this.isPlayingSubscription = this.audioService.isPlaying$.subscribe(
      (isPlaying) => {
        this.isPlaying = isPlaying;
      }
    );

    this.currentTimeSubscription = this.audioService
      .getCurrentTime()
      .subscribe((currentTime) => {
        this.currentTime = currentTime;
      });

    this.duration = await this.audioService.getDuration();
    console.log(this.indexMusicList);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['music'] && this.music) {
      // this.musicsList = [this.musicPrev, this.music, this.musicAfter];
    }
  }
  playMusic() {
    if (!this.audioService.isPlaying()) {
      this.audioService.play(this.music.url);
    } else {
      this.audioService.resume();
    }
  }

  pauseMusic() {
    if (this.audioService.isPlaying()) {
      this.audioService.pause();
    }
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.audioService.pause();
    } else {
      this.audioService.resume();
    }
    this.isPlaying = !this.isPlaying;
  }

  async playPrevMusic() {
    this.nextSong.emit();
  }

  async playAfterMusic() {
    this.nextSong.emit();
  }

  formatTime(time: number): string {
    if (!isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${this.pad(minutes)}:${this.pad(seconds)}`;
    } else {
      return '00:00';
    }
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  seekMusic(event: any) {
    const newValue = event.detail.value;
    this.audioService.seek(newValue);
  }

  randomPlaylist() {
    if (this.currentPlaybackMode != PlaybackMode.Shuffle) {
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
    if (this.currentPlaybackMode != PlaybackMode.Loop) {
      this.currentPlaybackMode = PlaybackMode.Loop;
      this.buttonColorLoop = 'success';
      this.buttonFillLoop = 'solid';
    } else {
      this.currentPlaybackMode = PlaybackMode.Default;
      this.buttonColorLoop = '';
      this.buttonFillLoop = '';
    }
  }

  ngOnDestroy(): void {
    this.isPlayingSubscription.unsubscribe();
    this.currentTimeSubscription.unsubscribe();
  }
}
