import { Component, Input, OnInit, inject } from '@angular/core';
import { IonImg, IonRow, IonCol, IonText } from '@ionic/angular/standalone';
import { SongOptionComponent } from '../../button/song-option/song-option.component';
import { Router } from '@angular/router';
import { IArtist } from 'src/app/core/interfaces/user';

@Component({
  selector: 'app-artist-container',
  templateUrl: './artist-container.component.html',
  styleUrls: ['./artist-container.component.scss'],
  standalone: true,
  imports: [IonText, IonCol, IonRow, IonImg, SongOptionComponent],
})
export class ArtistContainerComponent {
  @Input() artist: IArtist;
  private router = inject(Router);
  constructor() {}

  redirectToArtist() {
    this.router.navigate(['/home/artist-page/' + this.artist.userId]);
  }
}
