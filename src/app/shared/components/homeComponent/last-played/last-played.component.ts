import { Component, inject, OnInit } from '@angular/core';
import {
  IonCol,
  IonGrid,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRow,
  IonContent,
  IonList,
  InfiniteScrollCustomEvent,
  IonItem,
  IonLabel,
  IonAvatar,
} from '@ionic/angular/standalone';
import { SongOptionComponent } from '../../button/song-option/song-option.component';
import { SeeAllComponent } from '../../button/see-all/see-all.component';
import { IPlaylist } from 'src/app/core/interfaces/playlistes';
import { SectionWithDropdownComponent } from '../../section-with-dropdown/section-with-dropdown.component';
import { ISong } from 'src/app/core/interfaces/song';
import { selectLastSongsByUser } from 'src/app/core/store/selector/song.selector';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';

@Component({
  selector: 'app-last-played',
  templateUrl: './last-played.component.html',
  standalone: true,
  styleUrls: ['./last-played.component.scss'],
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    SongOptionComponent,
    SeeAllComponent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    IonContent,
    IonItem,
    IonLabel,
    IonAvatar,
    SectionWithDropdownComponent,
  ],
})
export class LastPlayedComponent implements OnInit {
  musicList: ISong[];
  store = inject(Store<AppState>);

  constructor() {}

  ngOnInit() {
    this.store.select(selectLastSongsByUser).subscribe({
      next: (songs) => {
        this.musicList = songs; // Doit être un tableau
      },
      error: (err) => {
        // console.error('[DEBUG] Error in subscription:', err);
      },
    });
    this.generateItems();
  }

  private generateItems() {}

  onIonInfinite(ev: any) {}
}
