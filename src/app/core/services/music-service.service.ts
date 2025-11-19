import { inject, Injectable, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AudioPlayer } from '@mediagrid/capacitor-native-audio';
import { BehaviorSubject, Subject } from 'rxjs';

import { ISong, PlaybackMode } from '../interfaces/song';

@Injectable({ providedIn: 'root' })
export class MusicServiceService {
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSubject.asObservable();
  private webAudio: HTMLAudioElement | null = null;
  private isWeb: boolean;
  private currentTimeSubject = new BehaviorSubject<number>(0);
  private playbackMode: PlaybackMode = PlaybackMode.Default;
  private navigationRequestSubject = new Subject<'next' | 'shuffle'>();
  navigationRequest$ = this.navigationRequestSubject.asObservable();
  currentTime$ = this.currentTimeSubject.asObservable();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private currentTimeInterval: any;
  PRIMARY_AUDIO_ID = 'main-track';
  private durationSubject = new BehaviorSubject<number>(0);
  duration$ = this.durationSubject.asObservable();
  private currentSongSubject = new BehaviorSubject<ISong | null>(null);
  currentSong$ = this.currentSongSubject.asObservable();
  private zone: NgZone = inject(NgZone);
  private isAudioActiveSubject = new BehaviorSubject<boolean>(false);
  isAudioActive$ = this.isAudioActiveSubject.asObservable();

  // Flag pour s'assurer que les événements ne sont enregistrés qu'une seule fois
  private listenersRegistered = false;

  constructor(private platform: Platform) {
    this.isWeb = !this.platform.is('capacitor');
  }
  isAudioActiveNow(): boolean {
    return this.isAudioActiveSubject.getValue();
  }
  public init() {
    if (this.platform.is('capacitor') && !this.listenersRegistered) {
      console.log('[MUSIC SERVICE] Initialisation des Event Listeners...');
      this.initializeEventListeners();
      this.startCurrentTimeUpdater();
      this.listenersRegistered = true;
    } else if (this.platform.is('capacitor') && this.listenersRegistered) {
      // Les listeners sont déjà enregistrés, on démarre juste l'updater si ce n'est pas fait
      this.startCurrentTimeUpdater();
    }
  }

  setPlaybackMode(mode: PlaybackMode) {
    this.playbackMode = mode;
    console.log(`[AUDIO SERVICE] Mode de lecture défini sur: ${mode}`);
  }

  isPlayingNow(): boolean {
    return this.isPlayingSubject.getValue();
  }

  private initializeWebAudioListeners() {
    if (!this.webAudio) return;
    this.webAudio.onloadedmetadata = () => {
      const duration = this.webAudio!.duration;
      if (isFinite(duration)) {
        this.durationSubject.next(duration);
        console.log('Web Audio prêt, durée:', duration);
      }
    };

    this.webAudio.onended = () => {
      console.log(
        '[WEB AUDIO] Piste Web terminée. Vérification du mode de lecture...'
      );
      console.log(this.playbackMode);

      // 🛑 Étape de nettoyage commune pour le Web
      this.stopCurrentTimeUpdater(true);
      this.isPlayingSubject.next(false);

      switch (this.playbackMode) {
        case PlaybackMode.Loop:
        case PlaybackMode.LoopOne:
          console.log('🔄 [LOOP WEB] Relance du morceau en cours.');
          // Réinitialisation et lecture de l'élément HTMLAudioElement
          this.webAudio!.currentTime = 0;
          this.webAudio!.play();
          this.isPlayingSubject.next(true); // Remet l'état de lecture à True
          this.startCurrentTimeUpdater();
          break;

        case PlaybackMode.Shuffle:
          console.log('🎲 [SHUFFLE WEB] Émission de la requête "shuffle".'); // ÉMETTRE l'événement pour la page PlaySongPage
          this.navigationRequestSubject.next('shuffle');
          break;

        case PlaybackMode.Default:
          console.log('➡️ [DEFAULT WEB] Émission de la requête "next".'); // ÉMETTRE l'événement pour la page PlaySongPage
          this.navigationRequestSubject.next('next');
          break;

        default:
          // Si le mode n'est pas reconnu ou non géré (ex: Pause), l'état est déjà False par le nettoyage commun
          console.log('[WEB AUDIO] Piste terminée. Arrêt.');
          break;
      }
    };
    this.webAudio.onplay = () => this.isPlayingSubject.next(true);
    this.webAudio.onpause = () => this.isPlayingSubject.next(false);
  }

  private initializeEventListeners() {
    // 1. Écoutez quand l'audio est prêt pour récupérer la durée (Comme dans l'exemple)
    AudioPlayer.onAudioReady({ audioId: this.PRIMARY_AUDIO_ID }, async () => {
      this.zone.run(async () => {
        try {
          const { duration } = await AudioPlayer.getDuration({
            audioId: this.PRIMARY_AUDIO_ID,
          });
          console.log('[NATIVE READY] Audio prêt, durée:', duration);
          this.durationSubject.next(duration); // <-- Corrigé le nom
        } catch (e) {
          console.error(
            '[NATIVE READY ERROR] Impossible de récupérer la durée:',
            e
          );
        }
      });
    });

    // 2. Écoutez l'événement de fin de piste (Comme dans l'exemple)
    AudioPlayer.onAudioEnd({ audioId: this.PRIMARY_AUDIO_ID }, async () => {
      this.zone.run(() => {
        this.handleAudioEndLogic();
      });
    });

    // 3. Écoute des événements de l'écran de verrouillage
    AudioPlayer.onPlaybackStatusChange(
      { audioId: this.PRIMARY_AUDIO_ID },
      (result) => {
        this.zone.run(() => {
          switch (result.status) {
            // 🛑 CORRIGER : Mettre à jour l'état au lieu de redonner l'ordre natif
            case 'playing':
              this.isPlayingSubject.next(true);
              this.startCurrentTimeUpdater();
              break;
            case 'paused':
              this.isPlayingSubject.next(false);
              this.stopCurrentTimeUpdater();
              break;
            case 'stopped':
              this.isPlayingSubject.next(false);
              this.stopCurrentTimeUpdater(true);
              break;
            default:
              // Pas de commande AudioPlayer.stop() ici, car l'événement est déjà une commande
              break;
          }
        });
      }
    );
  }

  private handleAudioEndLogic() {
    // 🛑 Étape de nettoyage commune
    this.stopCurrentTimeUpdater(true);
    this.isPlayingSubject.next(false);

    // Le stop est géré dans le cleanup de l'updater, si nécessaire, ou après la navigation.
    // Pour les modes Shuffle/Default, le morceau sera détruit et recréé par loadAndPlay().

    switch (this.playbackMode) {
      case PlaybackMode.Loop:
      case PlaybackMode.LoopOne:
        console.log('🔄 [LOOP/LOOP ONE] Relance du morceau en cours.');
        // 👉 OUI, il suffit de seek(0) et play pour relancer l'audio qui est déjà 'create'.
        // On doit également arrêter l'audio avant de rejouer pour réinitialiser le statut natif correctement.
        AudioPlayer.stop({ audioId: this.PRIMARY_AUDIO_ID });

        this.seek(0).then(() => {
          AudioPlayer.play({ audioId: this.PRIMARY_AUDIO_ID });
          this.isPlayingSubject.next(true); // Remet l'état de lecture à True
          this.startCurrentTimeUpdater();
        });
        break;

      case PlaybackMode.Shuffle:
        console.log('🎲 [SHUFFLE] Émission de la requête "shuffle".');
        // ÉMETTRE l'événement pour la page PlaySongPage
        this.navigationRequestSubject.next('shuffle');
        break;

      case PlaybackMode.Default:
        console.log('➡️ [DEFAULT] Émission de la requête "next".');
        // ÉMETTRE l'événement pour la page PlaySongPage
        this.navigationRequestSubject.next('next');
        break;
    }
  }

  // MODIFIÉ: L'exemple utilise un intervalle pour getCurrentTime.
  // Nous l'activons/désactivons désormais en fonction du statut de lecture.
  private startCurrentTimeUpdater() {
    if (this.currentTimeInterval) {
      return; // Déjà en cours
    } // Mise à jour toutes les 500ms
    this.currentTimeInterval = setInterval(async () => {
      if (this.isWeb && this.webAudio) {
        // 👈 AJOUT DE LA LOGIQUE WEB
        this.currentTimeSubject.next(this.webAudio.currentTime);
      } else if (!this.isWeb) {
        // Logique Native existante
        try {
          const { currentTime } = await AudioPlayer.getCurrentTime({
            audioId: this.PRIMARY_AUDIO_ID,
          });
          this.currentTimeSubject.next(currentTime); // console.log(`currentTime: ${currentTime}`); // Log que vous voyez chaque seconde
        } catch (e) {
          // Si l'audio est détruit/n'existe plus, arrêter l'updater
          this.stopCurrentTimeUpdater();
        }
      }
    }, 500);
  }

  // NOUVEAU: Méthode pour arrêter l'updater, comme dans l'exemple (stopCurrentPositionUpdate)
  private stopCurrentTimeUpdater(resetTime = false): void {
    if (this.currentTimeInterval) {
      clearInterval(this.currentTimeInterval);
      this.currentTimeInterval = null;
    }
    if (resetTime) {
      this.currentTimeSubject.next(0);
    }
  }

  async loadAndPlay(song: ISong) {
    if (this.isWeb) {
      this.destroy();
      this.webAudio = new Audio(song.url);
      this.initializeWebAudioListeners();
      this.webAudio.play();
      this.startCurrentTimeUpdater();
      this.currentSongSubject.next(song);
      this.isAudioActiveSubject.next(true);
    } else {
      // 1. Détruire l'ancienne source (si elle existe)
      try {
        await AudioPlayer.destroy({ audioId: this.PRIMARY_AUDIO_ID });
        this.listenersRegistered = false;
      } catch (e) {
        console.warn('Destroy before create failed, probably not initialized.');
      }

      // 2. CREATE la nouvelle source audio (Comme dans l'exemple)
      await AudioPlayer.create({
        audioSource: song.url,
        albumTitle: song.albumInfo?.title || 'Inconnu',
        artistName: song.artistInfo?.firstName || 'Inconnu',
        friendlyTitle: song.title,
        useForNotification: true,
        artworkSource: song.albumInfo?.cover || '',
        audioId: this.PRIMARY_AUDIO_ID,
        // Ces paramètres sont VRAIMENT importants pour la détection de la fin
        loop: this.playbackMode === PlaybackMode.Loop, // Définir loop ici si le mode est Loop
        isBackgroundMusic: false,
        showSeekForward: true,
        showSeekBackward: true,
      }).catch((e) => console.error('AudioPlayer.create failed:', e));

      this.currentSongSubject.next(song);
      this.isAudioActiveSubject.next(true);
      if (!this.isWeb) {
        this.init(); // Appel la méthode init pour enregistrer les listeners une seule fois
      }
      // 3. INITIALIZE la source audio (Comme dans l'exemple)
      // Ceci force le chargement et déclenche onAudioReady (si la source est valide)
      await AudioPlayer.initialize({ audioId: this.PRIMARY_AUDIO_ID }).catch(
        (e) => console.error('AudioPlayer.initialize failed:', e)
      );

      // 4. PLAY la source audio
      await AudioPlayer.play({ audioId: this.PRIMARY_AUDIO_ID }).catch((e) =>
        console.error('AudioPlayer.play failed:', e)
      );

      // 5. Mettre à jour les états RxJS et l'updater
      this.isPlayingSubject.next(true);
      this.startCurrentTimeUpdater();
    }
  }

  async pause() {
    if (this.isWeb && this.webAudio) {
      await this.webAudio.pause();
    } else if (!this.isWeb) {
      await AudioPlayer.pause({ audioId: this.PRIMARY_AUDIO_ID });
      this.stopCurrentTimeUpdater();
    }
    this.isPlayingSubject.next(false);
  }

  async resume() {
    if (this.isWeb && this.webAudio) {
      await this.webAudio.play();
    } else if (!this.isWeb) {
      await AudioPlayer.play({ audioId: this.PRIMARY_AUDIO_ID });
      this.startCurrentTimeUpdater();
    }
    this.isPlayingSubject.next(true);
  }

  async seek(timeInSeconds: number) {
    if (this.isWeb && this.webAudio) {
      this.webAudio.currentTime = timeInSeconds;
    } else if (!this.isWeb) {
      await AudioPlayer.seek({ audioId: this.PRIMARY_AUDIO_ID, timeInSeconds });
    }

    this.currentTimeSubject.next(timeInSeconds);
  }

  getCurrentTime$() {
    return this.currentTime$;
  }

  destroy() {
    // ... (Logique Web existante) ...
    this.listenersRegistered = false;
    if (this.isWeb && this.webAudio) {
      this.webAudio?.pause();
      this.webAudio.src = '';
      this.webAudio.currentTime = 0;
      this.webAudio?.load();
      this.webAudio = null;
      this.isPlayingSubject.next(false);
      this.currentTimeSubject.next(0);
      this.durationSubject.next(0);
      this.stopCurrentTimeUpdater();
      this.isAudioActiveSubject.next(false);
    } else if (!this.isWeb) {
      this.stopCurrentTimeUpdater(true);
      try {
        // 🛑 ÉTAPE 1 : Arrêter la lecture pour nettoyer la notification
        AudioPlayer.stop({ audioId: this.PRIMARY_AUDIO_ID });
      } catch (e) {
        console.warn('Stop failed during destroy:', e);
      }

      this.delay(100).then(() => {
        // 🛑 ÉTAPE 2 : Détruire la ressource
        try {
          AudioPlayer.destroy({ audioId: this.PRIMARY_AUDIO_ID });
          this.isPlayingSubject.next(false);
          this.currentTimeSubject.next(0);
          this.durationSubject.next(0);
        } catch (e) {
          console.warn('Destroy failed:', e);
        }
      });
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
