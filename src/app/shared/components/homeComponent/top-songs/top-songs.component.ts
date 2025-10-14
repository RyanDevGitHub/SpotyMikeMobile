import { Component, Input, OnInit } from '@angular/core';
import {
  InfiniteScrollCustomEvent,
  IonCol,
  IonContent,
  IonImg,
  IonRow,
  IonList,
  IonInfiniteScrollContent,
  IonInfiniteScroll,
} from '@ionic/angular/standalone';
import { IonGrid } from '@ionic/angular/standalone';
import { SeeAllComponent } from '../../button/see-all/see-all.component';
import { Observable, of } from 'rxjs';
import { ISong, SongGenre } from 'src/app/core/interfaces/song';
import { CommonModule } from '@angular/common';
import { MusicContainerComponent } from '../../containers/music-container/music-container.component';
import { MusicContainerVerticalComponent } from '../../containers/music-container-vertical/music-container-vertical.component';

@Component({
  selector: 'app-top-songs',
  templateUrl: './top-songs.component.html',
  standalone: true,
  styleUrls: ['./top-songs.component.scss'],
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    SeeAllComponent,
    IonContent,
    IonList,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    CommonModule,
    MusicContainerVerticalComponent,
  ],
})
export class TopSongsComponent {
  @Input() items: ISong[] | null;
  constructor() {}

  // private generateItems(existingItems: IMusicDate[]): IMusicDate[] {
  //   const count = existingItems.length + 1;
  //   const newItems: IMusicDate[] = [];
  //   for (let i = 0; i < 50; i++) {
  //     newItems.push({
  //       id: `item-${count + i}`,
  //       title: `Titre ${count + i}`,
  //       artistId: 'artiste-placeholder',
  //       cover: 'assets/avatar/album-photo.jpg',
  //       url: '',
  //       lyrics: '',
  //       duration: '',
  //       listeningCount: '0',
  //       featuring: [],
  //       createAt: new Date(),
  //       genre: MusicGenre.Rock,
  //     });
  //   }
  //   return [...existingItems, ...newItems];
  // }
}
