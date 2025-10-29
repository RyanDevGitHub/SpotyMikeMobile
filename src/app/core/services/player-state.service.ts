import { MinimizePlayerAudioComponent } from './../../shared/components/playerComponents/minimize-player-audio/minimize-player-audio.component';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ISong } from 'src/app/core/interfaces/song';
import { MusicServiceService } from './music-service.service';

// @Injectable({ providedIn: 'root' })
// export class PlayerStateService {
//   private currentSongSubject = new BehaviorSubject<ISong | null>(null);
//   currentSong$ = this.currentSongSubject.asObservable();

//   private miniPlayerVisibleSubject = new BehaviorSubject<boolean>(false);
//   miniPlayerVisible$ = this.miniPlayerVisibleSubject.asObservable();

//   minimizePlayerAudioService = inject(MinimizePlayerAudioService);

//   setCurrentSong(song: ISong) {
//     this.currentSongSubject.next(song);
//   }

//   setMiniPlayerVisible(visible: boolean) {
//     if (visible) {
//       this.minimizePlayerAudioService.showMiniPlayer();
//     }
//   }
// }
@Injectable({ providedIn: 'root' })
export class PlayerStateService {
  private currentSongSubject = new BehaviorSubject<ISong | null>(null);
  currentSong$ = this.currentSongSubject.asObservable();

  private miniPlayerVisibleSubject = new BehaviorSubject<boolean>(false);
  miniPlayerVisible$ = this.miniPlayerVisibleSubject.asObservable();

  musicService = inject(MusicServiceService); // injection du MusicService

  constructor() {
    // On écoute si la musique est en cours pour afficher/masquer le mini-player
    this.musicService.isPlaying$.subscribe((isPlaying) => {
      if (isPlaying && this.currentSongSubject.value) {
        this.setMiniPlayer(true);
      } else if (!isPlaying) {
        this.setMiniPlayer(false);
      }
    });
  }

  setCurrentSong(song: ISong) {
    this.currentSongSubject.next(song);

    // Si on change de chanson, on affiche le mini-player
    if (song) {
      this.setMiniPlayer(true);
    }
  }

  setMiniPlayer(visible: boolean) {
    this.miniPlayerVisibleSubject.next(visible);
  }
}
