import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { createGesture, IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { ISong } from 'src/app/core/interfaces/song';
import { MusicServiceService } from 'src/app/core/services/music-service.service';
import { PlayerStateService } from 'src/app/core/services/player-state.service';
import { PlaySongPage } from 'src/app/shared/modal/play-song/play-song.page';

import { MusicNavBarComponent } from '../music-nav-bar/music-nav-bar.component';

@Component({
  selector: 'app-minimize-player-audio',
  templateUrl: './minimize-player-audio.component.html',
  styleUrls: ['./minimize-player-audio.component.scss'],
  imports: [IonicModule, CommonModule, MusicNavBarComponent],
  standalone: true,
})
export class MinimizePlayerAudioComponent implements OnInit, OnDestroy {
  // audio!: HTMLAudioElement;
  isPlaying = false;

  private musicService = inject(MusicServiceService);
  private playerService = inject(PlayerStateService);
  private modalCtrl = inject(ModalController);
  private subscriptions: Subscription = new Subscription();
  public _music: ISong | null = null;

  @ViewChild('miniPlayer', { static: true }) miniPlayer!: ElementRef;

  ngOnInit() {
    this.initSwipeGesture();
    console.log(this.musicService.currentSong$);

    this.subscriptions.add(
      this.playerService.currentSong$.subscribe((song) => {
        this._music = song;
      })
    );
  }

  async openPlayerModal() {
    // 🛑 Vérifie s'il y a un morceau en cours avant d'ouvrir
    if (!this._music) {
      console.warn(
        "[Mini Player] Tentative d'ouverture mais aucun morceau en cours."
      );
      return;
    }

    // Note: Le contexte de lecture (openWith) n'est pas directement stocké ici,
    // mais le service PlayerStateService le connaît. Par simplicité ici,
    // nous ouvrons la modale en passant juste la chanson, en supposant que
    // le contexte sera géré dans PlaySongPage (sinon, vous devrez
    // stocker et récupérer `currentPlayContext` du PlayerStateService).

    // Si vous stockez le contexte dans PlayerStateService:
    // const currentContext = this.playerService.getCurrentPlayContext(); // *Méthode hypothétique*

    const modal = await this.modalCtrl.create({
      component: PlaySongPage,
      componentProps: {
        music: this._music, // Le morceau en cours
        // Si vous stockez le contexte: openWith: currentContext,
        // Sinon, vous devrez gérer le contexte dans PlaySongPage si non fourni
        openWith: this.playerService.getCurrentPlayContext(), // Exemple minimal si contexte non stocké
      },
    });

    // 💡 Après l'ouverture réussie de la modale pleine page, on peut masquer le mini-lecteur
    // Le mini-lecteur est généralement masqué automatiquement si le composant PlaySongPage
    // est une modale plein écran qui se superpose, mais c'est une bonne pratique.
    // Cependant, dans votre architecture, c'est le PlayerStateService qui gère l'état visible.
    // Vous pouvez informer le service que la modale est ouverte si vous avez un `ModalStateService`.

    await modal.present();
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
            this.musicService.destroy();
          }, 300);
        } else {
          this.miniPlayer.nativeElement.style.transition = '0.2s ease-out';
          this.miniPlayer.nativeElement.style.transform = 'translateX(0)';
        }
      },
    });
    gesture.enable(true);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
