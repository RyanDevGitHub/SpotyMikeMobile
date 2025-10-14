import { AsyncPipe } from '@angular/common';
import { MinimizePlayerAudioComponent } from '../../shared/components/playerComponents/minimize-player-audio/minimize-player-audio.component';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { IonToast } from '@ionic/angular/standalone';
import { IonButton, IonGrid, IonIcon, IonRow } from '@ionic/angular/standalone';
import { IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  heartOutline,
  homeOutline,
  personOutline,
  playOutline,
} from 'ionicons/icons';
import { MinimizePlayerAudioService } from 'src/app/core/services/minimize-player-audio.service';
import { MusicServiceService } from 'src/app/core/services/music-service.service';
import { PlayerStateService } from 'src/app/core/services/player-state.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.page.html',
  standalone: true,
  styleUrls: ['./accueil.page.scss'],
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonGrid,
    IonRow,
    MinimizePlayerAudioComponent,
    IonButton,
    IonToast,
    MinimizePlayerAudioComponent,
    AsyncPipe,
  ],
})
export class AccueilPage {
  miniPlayerVisible$ = this.playerState.miniPlayerVisible$;
  currentSong$ = this.playerState.currentSong$;

  constructor(
    @Inject(MusicServiceService) public audioService: MusicServiceService,
    @Inject(MinimizePlayerAudioService)
    public minimizePlayerAudioService: MinimizePlayerAudioService,
    private playerState: PlayerStateService
  ) {
    addIcons({ heartOutline, homeOutline, playOutline, personOutline });
  }
}
