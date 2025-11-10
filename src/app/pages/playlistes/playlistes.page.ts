import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppState } from '@capacitor/app';
import {
  IonContent,
  IonGrid,
  ModalController,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { selectUserPlaylists } from 'src/app/core/store/selector/user.selector';
import { PlaylistContainerComponent } from 'src/app/shared/components/containers/playlist-container/playlist-container.component';
import { HeaderCategoryComponent } from 'src/app/shared/components/headers/header-category/header-category.component';

@Component({
  selector: 'app-playlistes',
  templateUrl: './playlistes.page.html',
  styleUrls: ['./playlistes.page.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonContent,
    CommonModule,
    FormsModule,
    HeaderCategoryComponent,
    AsyncPipe,
    PlaylistContainerComponent,
  ],
})
export class PlaylistesPage implements OnInit, OnDestroy {
  public isModalOpen = false;
  private modalSubscription: Subscription;
  private store = inject(Store<AppState>);
  private router = inject(Router);
  constructor(
    private modalCtrl: ModalController,
    private modalStateService: ModalStateService,
  ) {
    this.modalSubscription = modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value),
    );
  }
  public listPlaylistes = this.store.select(selectUserPlaylists);

  ngOnInit() {
    console.log(this.isModalOpen);
    this.listPlaylistes.subscribe((playlists) => {
      console.log('Playlists depuis le store:', playlists);
    });
  }

  async openPlaylist(id: string) {
    this.router.navigate(['/home/playlist/' + id]);
  }
  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }
}
