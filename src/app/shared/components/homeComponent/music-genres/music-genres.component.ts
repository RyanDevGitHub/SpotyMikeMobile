import { Component } from '@angular/core';
import { IonButton, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';

import { SeeAllComponent } from '../../button/see-all/see-all.component';

@Component({
  selector: 'app-music-genres',
  templateUrl: './music-genres.component.html',
  styleUrls: ['./music-genres.component.scss'],
  standalone: true,
  imports: [IonGrid, SeeAllComponent, IonCol, IonRow, IonButton],
})
export class MusicGenresComponent {
  selectedGenre: string = 'all';
  constructor() {}

  selectGenre(genre: string) {
    this.selectedGenre = genre;
  }
}
