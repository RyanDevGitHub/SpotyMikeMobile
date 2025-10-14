import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { HeaderCategoryComponent } from 'src/app/shared/components/headers/header-category/header-category.component';
import { DisplayItemComponent } from 'src/app/shared/components/display-item/display-item.component';
import { IPlaylist, IPlaylistRaw } from 'src/app/core/interfaces/playlistes';
import { ISong } from 'src/app/core/interfaces/song';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import {
  selectLastSongsByUser,
  selectSortedLastPlayedSongs,
} from 'src/app/core/store/selector/song.selector';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-last-played',
  templateUrl: './last-played.page.html',
  styleUrls: ['./last-played.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    HeaderCategoryComponent,
    DisplayItemComponent,
  ],
})
export class LastPlayedPage implements OnInit {
  constructor() {}

  store = inject(Store<AppState>);
  public listMusics = signal<ISong[]>([]);
  public listPlaylistes: IPlaylistRaw[];

  ngOnInit() {
    // On se subscribe directement au selecteur trié
    this.store.select(selectSortedLastPlayedSongs).subscribe({
      next: (songs) => {
        console.log('🎵 LastPlayed trié reçu du store :', songs);
        this.listMusics.set(songs); // ⚡ met à jour le signal
      },
      error: (err) => {
        console.error('[DEBUG] Error in subscription:', err);
      },
    });
  }
}
