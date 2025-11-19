import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { PlayPageType } from 'src/app/core/interfaces/play-page-type';
import { ISong } from 'src/app/core/interfaces/song';

import { SeeAllComponent } from '../../button/see-all/see-all.component';
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

    SeeAllComponent,

    CommonModule,
    MusicContainerVerticalComponent,
  ],
})
export class TopSongsComponent {
  @Input() items: ISong[] | null;
  public pageType: PlayPageType = PlayPageType.TopSongs;
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
