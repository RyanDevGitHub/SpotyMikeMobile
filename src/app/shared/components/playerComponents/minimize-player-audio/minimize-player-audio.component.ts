import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { createGesture, IonicModule } from '@ionic/angular';
import { ISong } from 'src/app/core/interfaces/song';
import { MusicServiceService } from 'src/app/core/services/music-service.service';
import { PlayerStateService } from 'src/app/core/services/player-state.service';

import { MusicNavBarComponent } from '../music-nav-bar/music-nav-bar.component';

@Component({
  selector: 'app-minimize-player-audio',
  templateUrl: './minimize-player-audio.component.html',
  styleUrls: ['./minimize-player-audio.component.scss'],
  imports: [IonicModule, CommonModule, MusicNavBarComponent],
  standalone: true,
})
export class MinimizePlayerAudioComponent implements OnInit {
  @Input() music: ISong | null = null;

  // audio!: HTMLAudioElement;
  isPlaying = false;

  private musicService = inject(MusicServiceService);
  private playerService = inject(PlayerStateService);

  @ViewChild('miniPlayer', { static: true }) miniPlayer!: ElementRef;

  ngOnInit() {
    this.initSwipeGesture();
    console.log(this.musicService.currentSong$);
  }

  initSwipeGesture() {
    const gesture = createGesture({
      el: this.miniPlayer.nativeElement,
      threshold: 15,
      gestureName: 'swipe-to-close',
      onMove: (ev) => {
        this.miniPlayer.nativeElement.style.transform = `translateX(${ev.deltaX}px)`;
      },
      onEnd: (ev) => {
        if (Math.abs(ev.deltaX) > 100) {
          this.miniPlayer.nativeElement.style.transition = '0.3s ease-out';
          this.miniPlayer.nativeElement.style.transform =
            ev.deltaX > 0 ? 'translateX(100%)' : 'translateX(-100%)';
          setTimeout(() => {
            this.playerService.setMiniPlayer(false); // 🔹 Supprime du DOM
          }, 300);
        } else {
          this.miniPlayer.nativeElement.style.transition = '0.2s ease-out';
          this.miniPlayer.nativeElement.style.transform = 'translateX(0)';
        }
      },
    });
    gesture.enable(true);
  }
}
