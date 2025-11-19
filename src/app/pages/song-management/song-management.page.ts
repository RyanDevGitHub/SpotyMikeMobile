import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '@capacitor/app';
import {
  InfiniteScrollCustomEvent,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonList,
  IonRow,
  ModalController,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { Subject, Subscription, takeUntil } from 'rxjs';
import {
  PlayContext,
  PlayPageType,
} from 'src/app/core/interfaces/play-page-type';
import { ISong } from 'src/app/core/interfaces/song';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { debugSelectAllSongs } from 'src/app/core/store/selector/song.selector';
import { MusicContainerComponent } from 'src/app/shared/components/containers/music-container/music-container.component';
import { HeaderSettingComponent } from 'src/app/shared/components/headers/header-setting/header-setting.component';
import { AddSongModalComponent } from 'src/app/shared/modal/add-song-modal/add-song-modal.component';

@Component({
  selector: 'app-song-management',
  templateUrl: './song-management.page.html',
  styleUrls: ['./song-management.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonList,
    IonContent,
    HeaderSettingComponent,
    IonGrid,
    IonCol,
    IonRow,
    MusicContainerComponent,
  ],
})
export class SongManagementPage implements OnInit, OnDestroy {
  songs: ISong[] = [];
  store = inject(Store<AppState>);
  modalStateService = inject(ModalStateService);
  private unsubscribe$ = new Subject<void>();
  public isModalOpen: boolean;
  public pageType = PlayPageType.Independently;
  public playContext: PlayContext;
  private modalSubscription: Subscription;
  constructor(private modalController: ModalController) {
    this.modalSubscription = this.modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value)
    );
    this.playContext = { type: this.pageType };
  }

  ngOnInit() {
    // this.store.dispatch(loadSong());

    this.store
      .select(debugSelectAllSongs)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (songs) => {
          // console.log('[DEBUG] Songs in subscription:', songs);
          this.songs = songs;
        },
        error: (err) => {
          console.error('[DEBUG] Error in subscription:', err);
        },
      });
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 5000);
  }

  async openModalAddSong() {
    const modal = await this.modalController.create({
      component: AddSongModalComponent, // Modal
      cssClass: 'add-song-modal-class', // Classe CSS optionnelle
    });
    await modal.present();

    // Récupérer les données après fermeture du modal (si nécessaire)
    const { data } = await modal.onDidDismiss();
    if (data) {
      console.log('Nouveau son ajouté :', data);
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }
}
