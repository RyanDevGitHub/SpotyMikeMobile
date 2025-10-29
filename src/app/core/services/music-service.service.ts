import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
// Supposons que ceci est la façon d'importer l'API du plugin Native Audio
import { AudioPlayer } from '@mediagrid/capacitor-native-audio';
import { ISong } from '../interfaces/song'; // Assurez-vous d'importer ISong

@Injectable({ providedIn: 'root' })
export class MusicServiceService {
  // ⚠️ On utilise BehaviorSubject pour l'état de lecture afin qu'il émette la dernière valeur immédiatement
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  private currentTimeSubject = new BehaviorSubject<number>(0);
  currentTime$ = this.currentTimeSubject.asObservable(); // Ajouté pour le temps d'écoute
  private currentTimeInterval: any = null;
  PRIMARY_AUDIO_ID = 'main-track';
  private durationValue: number = 0; // Stocker la durée

  constructor(private platform: Platform) {
    if (this.platform.is('capacitor')) {
      this.initializeEventListeners();
      this.startCurrentTimeUpdater(); // Lancement de la mise à jour du temps
    }
  }

  // Ajouté : Méthode pour vérifier l'état actuel (utilisée par le NavBar)
  isPlayingNow(): boolean {
    return this.isPlayingSubject.getValue();
  }

  private initializeEventListeners() {
    // Écoute des événements de l'écran de verrouillage
    AudioPlayer.onPlaybackStatusChange(
      { audioId: this.PRIMARY_AUDIO_ID },
      (result: { status: 'playing' | 'paused' | 'stopped' }) => {
        console.log('Changement de statut externe:', result.status);
        const isPlaying = result.status === 'playing';

        // 👈 MISE À JOUR CRUCIALE : Synchroniser l'état de l'application avec les contrôles natifs
        this.isPlayingSubject.next(isPlaying);
      },
    );

    // Écoutez l'événement de fin de piste
    AudioPlayer.onAudioEnd({ audioId: this.PRIMARY_AUDIO_ID }, () => {
      console.log('Piste terminée');
      this.isPlayingSubject.next(false);
      // TODO: Appelez ici la logique pour passer à la chanson suivante dans PlayerStateService
    });

    // Écoutez quand l'audio est prêt pour récupérer la durée
    AudioPlayer.onAudioReady({ audioId: this.PRIMARY_AUDIO_ID }, async () => {
      const { duration } = await AudioPlayer.getDuration({
        audioId: this.PRIMARY_AUDIO_ID,
      });
      this.durationValue = duration;
    });
  }

  // Nouvelle méthode pour mettre à jour l'heure actuelle
  private startCurrentTimeUpdater() {
    if (this.currentTimeInterval) {
      clearInterval(this.currentTimeInterval);
    }
    // Mise à jour toutes les 500ms
    this.currentTimeInterval = setInterval(async () => {
      if (this.isPlayingSubject.getValue()) {
        try {
          const { currentTime } = await AudioPlayer.getCurrentTime({
            audioId: this.PRIMARY_AUDIO_ID,
          });
          this.currentTimeSubject.next(currentTime);
        } catch (e) {
          // Ignorer les erreurs si l'audio n'est pas prêt
        }
      }
    }, 500);
  }

  async loadAndPlay(song: ISong) {
    // Détruire l'ancienne source si elle existe
    try {
      await AudioPlayer.destroy({ audioId: this.PRIMARY_AUDIO_ID });
    } catch {}

    await AudioPlayer.create({
      audioSource: song.url,
      albumTitle: song.albumInfo?.title || 'Inconnu',
      artistName: song.artistInfo?.firstName || 'Inconnu',
      friendlyTitle: song.title,
      useForNotification: true,
      artworkSource: song.albumInfo?.cover || '',
      audioId: this.PRIMARY_AUDIO_ID,
      // ... autres paramètres ...
    });

    await AudioPlayer.initialize({ audioId: this.PRIMARY_AUDIO_ID });
    await AudioPlayer.play({ audioId: this.PRIMARY_AUDIO_ID });

    // 👈 Mettre à jour l'état RxJS
    this.isPlayingSubject.next(true);
  }

  async pause() {
    await AudioPlayer.pause({ audioId: this.PRIMARY_AUDIO_ID });
    this.isPlayingSubject.next(false); // 👈 Mettre à jour l'état RxJS
  }

  async resume() {
    await AudioPlayer.play({ audioId: this.PRIMARY_AUDIO_ID });
    this.isPlayingSubject.next(true); // 👈 Mettre à jour l'état RxJS
  }

  // Ajouté : Méthode pour la barre de progression
  async seek(timeInSeconds: number) {
    await AudioPlayer.seek({ audioId: this.PRIMARY_AUDIO_ID, timeInSeconds });
    this.currentTimeSubject.next(timeInSeconds); // Mise à jour immédiate de l'UI
  }

  // Ajouté : Méthode pour obtenir la durée (utilisée par le NavBar)
  getDuration(): Promise<number> {
    // Retourne la valeur stockée (mise à jour dans onAudioReady)
    return Promise.resolve(this.durationValue);
  }

  // Ajouté : Méthode pour obtenir le temps actuel (Observable)
  getCurrentTime$() {
    return this.currentTime$;
  }
}

// =============================
// 🔹 Méthodes non liées à la lecture
// =============================
// getSongs(): Observable<ISong[]> {
//   return from(this.songRepository.getAllSongsWithArtist()).pipe(
//     map((songs) => songs),
//     catchError((error) => {
//       console.error('Error in getSongs:', error);
//       throw error;
//     })
//   );
// }

// getAlbums(): Observable<IAlbum[]> {
//   return from(this.albumRepository.getAllAlbums()).pipe(
//     map((albums) => albums),
//     catchError((error) => {
//       console.error('Error in getAlbums:', error);
//       throw error;
//     })
//   );
// }

// getSongById(songId: string): Observable<ISong | null> {
//   return from(this.songRepository.getSongById(songId));
// }

// addSong(song: ISong): Observable<void> {
//   return from(this.songRepository.addSong(song));
// }

// // =============================
// // 🔹 Lecture audio
// // =============================
// async play(url: string) {
//   await this.stop();

//   return new Promise<void>((resolve, reject) => {
//     this.mediaInstance = new Media(
//       url,
//       () => console.log('Media play success'),
//       (err: any) => {
//         console.error('Media error', err);
//         reject(err);
//       },
//       (status: any) => {
//         // status: 0-none,1-starting,2-running,3-paused,4-stopped
//         // On peut utiliser pour debug
//         console.log('Media status', status);
//       }
//     );

//     this.mediaInstance.play();
//     this.isPlaying = true;
//     this.isPlayingSubject.next(true);

//     // Lancer interval pour currentTime
//     this.startCurrentTimeInterval();

//     resolve();
//   });
// }

// async pause() {
//   if (this.mediaInstance && this.isPlaying) {
//     this.mediaInstance.pause();
//     this.isPlaying = false;
//     this.isPlayingSubject.next(false);
//   }
// }

// async resume() {
//   if (this.mediaInstance && !this.isPlaying) {
//     this.mediaInstance.play();
//     this.isPlaying = true;
//     this.isPlayingSubject.next(true);
//   }
// }

// async stop() {
//   if (this.mediaInstance) {
//     this.mediaInstance.stop();
//     this.mediaInstance.release();
//     this.mediaInstance = null;
//     this.isPlaying = false;
//     this.isPlayingSubject.next(false);

//     if (this.currentTimeInterval) {
//       clearInterval(this.currentTimeInterval);
//       this.currentTimeInterval = null;
//     }
//     this.currentTimeSubject.next(0);
//   }
// }

// async seek(time: number) {
//   if (this.mediaInstance) {
//     this.mediaInstance.seekTo(time * 1000); // Media prend ms
//   }
// }

// async getDuration(): Promise<number> {
//   if (!this.mediaInstance) return 0;
//   return this.mediaInstance.getDuration(); // seconds
// }

// async getCurrentTime(): Promise<number> {
//   if (!this.mediaInstance) return 0;

//   return new Promise<number>((resolve) => {
//     this.mediaInstance.getCurrentPosition(
//       (position: number) => {
//         resolve(position);
//       },
//       (err: any) => {
//         console.error('Error getCurrentPosition', err);
//         resolve(0);
//       }
//     );
//   });
// }

// isPlayingNow(): boolean {
//   return this.isPlaying;
// }

// getCurrentTime$(): Observable<number> {
//   return this.currentTimeSubject.asObservable();
// }

// private startCurrentTimeInterval() {
//   if (this.currentTimeInterval) clearInterval(this.currentTimeInterval);

//   this.currentTimeInterval = setInterval(async () => {
//     if (this.mediaInstance) {
//       const currentTime = await this.getCurrentTime();
//       this.currentTimeSubject.next(currentTime);
//     }
//   }, 500);
// }

// // =============================
// // 🔹 Music Controls
// // =============================
// async createControls(track: {
//   title: string;
//   artist: string;
//   cover: string;
//   isPlaying: boolean;
// }) {
//   try {
//     await CapacitorMusicControls.create({
//       track: track.title,
//       artist: track.artist,
//       cover: track.cover,
//       isPlaying: track.isPlaying,
//       dismissable: true,
//       hasPrev: true,
//       hasNext: true,
//       hasClose: true,
//       ticker: 'Now playing ' + track.title,
//     });

//     this.listenToEvents();
//   } catch (err) {
//     console.error('Erreur création contrôles :', err);
//   }
// }

// async updateIsPlaying(isPlaying: boolean) {
//   this.isPlaying = isPlaying;
//   await CapacitorMusicControls.updateIsPlaying({ isPlaying });
// }

// async destroyControls() {
//   await CapacitorMusicControls.destroy();
// }

// private listenToEvents() {
//   CapacitorMusicControls.addListener('controlsEvent', (action: any) => {
//     const message = action.message;
//     console.log('🎧 Event:', message);

//     switch (message) {
//       case 'music-controls-next':
//         // TODO: musique suivante
//         break;
//       case 'music-controls-previous':
//         // TODO: musique précédente
//         break;
//       case 'music-controls-pause':
//         this.pause();
//         this.updateIsPlaying(false);
//         break;
//       case 'music-controls-play':
//         this.resume();
//         this.updateIsPlaying(true);
//         break;
//       case 'music-controls-destroy':
//         this.destroyControls();
//         this.stop();
//         break;
//     }
//   });
// }
