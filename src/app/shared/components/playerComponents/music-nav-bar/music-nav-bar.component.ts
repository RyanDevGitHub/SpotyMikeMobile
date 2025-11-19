import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonRange,
  IonRow,
  RangeCustomEvent,
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { ISong } from 'src/app/core/interfaces/song';
import { MusicServiceService } from 'src/app/core/services/music-service.service';
import { PlayerStateService } from 'src/app/core/services/player-state.service';

import { PlaybackMode } from '../../../../core/interfaces/song';

@Component({
  selector: 'app-music-nav-bar',
  templateUrl: './music-nav-bar.component.html',
  standalone: true,
  styleUrls: ['./music-nav-bar.component.scss'],
  imports: [IonButton, IonRange, IonIcon, IonGrid, IonCol, IonRow],
})
export class MusicNavBarComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isMini: boolean;
  @Input() music: ISong;
  @Output() navigateSong = new EventEmitter<'prev' | 'next' | 'shuffle'>();

  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;

  // ... (Déclarations de couleurs et de modes) ...
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
  private durationSubscription: Subscription;
  private playerState = inject(PlayerStateService);
  private cdRef = inject(ChangeDetectorRef);
  currentPlaybackMode: PlaybackMode = PlaybackMode.Default;

  constructor(private audioService: MusicServiceService) {}
  ngOnChanges(changes: SimpleChanges) {
    // Vérifie si la propriété 'music' a changé (et que la nouvelle valeur est définie)
    if (changes['music'] && changes['music'].currentValue) {
      const previousMusic: ISong = changes['music'].previousValue;
      const currentMusic: ISong = changes['music'].currentValue;

      // Évite de recharger si c'est le même morceau (par ID)
      if (!previousMusic || previousMusic.id !== currentMusic.id) {
        console.log(
          `🎵 [NAV BAR CHANGE] Morceau changé de ${
            previousMusic?.title || 'N/A'
          } à ${currentMusic.title}`
        );
      }
    }
  }
  async ngOnInit() {
    console.log(`[NAV BAR INIT] Démarrage du composant.`);
    this.isPlayingSubscription = this.audioService.isPlaying$.subscribe(
      (isPlaying) => {
        this.isPlaying = isPlaying;
        console.log(`[NAV BAR SYNC] isPlaying mis à jour à : ${isPlaying}`);
        this.cdRef.detectChanges();
      }
    );

    // 🎯 Correction 2 : Abonnement complet à getCurrentTime$
    this.currentTimeSubscription = this.audioService
      .getCurrentTime$()
      .subscribe((time) => {
        this.currentTime = time;
      });

    // 🎯 Correction 3 : Abonnement complet à duration$
    this.durationSubscription = this.audioService.duration$.subscribe(
      (durationValue) => {
        this.duration = durationValue;
        console.log(
          `[NAV BAR SYNC] Durée maximale mise à jour : ${this.duration}`
        );
      }
    );
  }
  togglePlayPause() {
    console.log(
      `[NAV BAR ACTION] Tentative de Toggle. isPlaying actuel: ${this.isPlaying}`
    ); // LOG TOGGLE
    if (this.isPlaying) this.pauseMusic();
    else this.playMusic();
  }

  async playMusic() {
    try {
      await this.audioService.resume();
    } catch (e) {
      // 2. Si resume échoue (car rien n'est chargé), alors chargez et jouez
      console.warn(
        "Reprise échouée, la piste n'est probablement pas chargée. Chargement complet."
      );
      await this.audioService.loadAndPlay(this.music);
    }
  }

  async pauseMusic() {
    console.log('[NAV BAR ACTION] Appel de pauseMusic()'); // LOG PAUSE
    if (this.audioService.isPlayingNow()) {
      await this.audioService.pause();
      console.log('[NAV BAR ACTION] Pause demandée au service.');
    } else {
      console.warn(
        "[NAV BAR ACTION] Pause demandée mais le service n'indique pas de lecture."
      );
    }
  }
  playPrevMusic() {
    if (this.currentPlaybackMode === PlaybackMode.Shuffle) {
      this.playerState.navigate('shuffle');
    } else {
      this.playerState.navigate('prev');
    }
  }

  playAfterMusic() {
    if (this.currentPlaybackMode === PlaybackMode.Shuffle) {
      this.playerState.navigate('shuffle');
    } else {
      this.playerState.navigate('next');
    }
  }

  async seekMusic(event: RangeCustomEvent) {
    const newTime = event.detail.value as number;
    console.log(`[NAV BAR ACTION] Demande de SEEK à : ${newTime} secondes.`); // LOG SEEK
    // Vérifiez que newTime est un nombre valide avant de l'envoyer au service
    if (typeof newTime === 'number' && !isNaN(newTime)) {
      await this.audioService.seek(newTime);
    } else {
      console.error(
        `[NAV BAR ACTION] Valeur de seek invalide : ${event.detail.value}`
      );
    }
  }

  // --- (Le reste de vos méthodes reste inchangé) ---

  randomPlaylist() {
    // Le mode Shuffle désactive le mode Loop s'il est actif.
    if (this.currentPlaybackMode !== PlaybackMode.Shuffle) {
      this.currentPlaybackMode = PlaybackMode.Shuffle;
      this.buttonColorShuffle = 'success';
      this.buttonFillShuffle = 'solid';
      this.audioService.setPlaybackMode(this.currentPlaybackMode);
      // Désactiver Loop si actif
      this.buttonColorLoop = '';
      this.buttonFillLoop = '';
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
      this.audioService.setPlaybackMode(this.currentPlaybackMode);
      // Désactiver Shuffle si actif
      this.buttonColorShuffle = '';
      this.buttonFillShuffle = '';
    } else {
      this.currentPlaybackMode = PlaybackMode.Default;
      this.buttonColorLoop = '';
      this.buttonFillLoop = '';
      this.audioService.setPlaybackMode(this.currentPlaybackMode);
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

  ngOnDestroy() {
    this.isPlayingSubscription?.unsubscribe();
    this.currentTimeSubscription?.unsubscribe();
    this.durationSubscription?.unsubscribe(); // 🆕 NETTOYAGE
  }
}
