import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppState } from '@capacitor/app';
import { IonContent } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { IPlaylistRaw } from 'src/app/core/interfaces/playlists';
import { ISong } from 'src/app/core/interfaces/song';
import { selectSortedLastPlayedSongs } from 'src/app/core/store/selector/song.selector';
import { DisplayItemComponent } from 'src/app/shared/components/display-item/display-item.component';
import { HeaderCategoryComponent } from 'src/app/shared/components/headers/header-category/header-category.component';

@Component({
  selector: 'app-last-played',
  templateUrl: './last-played.page.html',
  styleUrls: ['./last-played.page.scss'],
  standalone: true,
  imports: [
    IonContent,
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
