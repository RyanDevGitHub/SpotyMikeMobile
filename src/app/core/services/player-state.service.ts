import { MinimizePlayerAudioComponent } from './../../shared/components/playerComponents/minimize-player-audio/minimize-player-audio.component';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ISong } from 'src/app/core/interfaces/song';
import { MinimizePlayerAudioService } from './minimize-player-audio.service';

@Injectable({ providedIn: 'root' })
export class PlayerStateService {
  private currentSongSubject = new BehaviorSubject<ISong | null>(null);
  currentSong$ = this.currentSongSubject.asObservable();

  private miniPlayerVisibleSubject = new BehaviorSubject<boolean>(false);
  miniPlayerVisible$ = this.miniPlayerVisibleSubject.asObservable();

  minimizePlayerAudioService = inject(MinimizePlayerAudioService);

  setCurrentSong(song: ISong) {
    this.currentSongSubject.next(song);
  }

  setMiniPlayerVisible(visible: boolean) {
    if (visible) {
      this.minimizePlayerAudioService.showMiniPlayer();
    }
  }
}
