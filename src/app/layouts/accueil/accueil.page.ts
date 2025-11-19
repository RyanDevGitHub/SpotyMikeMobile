import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  IonGrid,
  IonIcon,
  IonRow,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';
import { filter, Subscription, tap, withLatestFrom } from 'rxjs';
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
export class AccueilPage implements OnInit, OnDestroy {
  miniPlayerVisible$ = this.playerState.miniPlayerVisible$;
  currentSong$ = this.playerState.currentSong$;

  private visibilitySubscription: Subscription; // Pour gérer la désinscription

  constructor(
    @Inject(MusicServiceService) public audioService: MusicServiceService,
    private playerState: PlayerStateService
  ) {}

  ngOnInit(): void {
    // 🎼 Logique d'abonnement pour la journalisation
    this.visibilitySubscription = this.miniPlayerVisible$
      .pipe(
        // 1. Filtrer uniquement lorsque la visibilité passe à TRUE
        filter((isVisible) => isVisible),
        // 2. Combiner avec la dernière valeur connue de la chanson en cours
        withLatestFrom(this.currentSong$),
        // 3. Journaliser l'information
        tap(([isVisible, song]) => {
          // isVisible sera toujours true ici grâce au filter()
          console.log('✅ Mini-player visible ! Chanson en cours :', song);
          console.log(isVisible);
          console.log(`Titre: ${song?.title || 'Aucun'}`);
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    // 🗑️ Ne pas oublier de se désinscrire pour éviter les fuites de mémoire
    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }
  }
}
