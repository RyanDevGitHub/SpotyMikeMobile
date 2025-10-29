import { Component, OnInit } from '@angular/core';
import { SeeAllComponent } from '../../button/see-all/see-all.component';
import { IonButton, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';

@Component({
  selector: 'app-music-genres',
  templateUrl: './music-genres.component.html',
  styleUrls: ['./music-genres.component.scss'],
  standalone: true,
  imports: [IonGrid, SeeAllComponent, IonCol, IonRow, IonButton],
})
export class MusicGenresComponent {
  selectedGenre: string = 'All';
  constructor() {}

  selectGenre(genre: string) {
    this.selectedGenre = genre;
  }
}
