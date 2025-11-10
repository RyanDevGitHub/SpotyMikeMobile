import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  IonGrid,
  IonIcon,
  IonRow,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';
import { MusicServiceService } from 'src/app/core/services/music-service.service';
import { PlayerStateService } from 'src/app/core/services/player-state.service';

import { MinimizePlayerAudioComponent } from '../../shared/components/playerComponents/minimize-player-audio/minimize-player-audio.component';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.page.html',
  standalone: true,
  styleUrls: ['./accueil.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonGrid,
    IonRow,
    MinimizePlayerAudioComponent,
    MinimizePlayerAudioComponent,
    AsyncPipe,
  ],
})
export class AccueilPage {
  miniPlayerVisible$ = this.playerState.miniPlayerVisible$;
  currentSong$ = this.playerState.currentSong$;

  constructor(
    @Inject(MusicServiceService) public audioService: MusicServiceService,
    private playerState: PlayerStateService
  ) {}
}
