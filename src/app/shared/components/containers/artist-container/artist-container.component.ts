import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IonCol, IonImg, IonRow, IonText } from '@ionic/angular/standalone';
import { IArtist } from 'src/app/core/interfaces/user';

@Component({
  selector: 'app-artist-container',
  templateUrl: './artist-container.component.html',
  styleUrls: ['./artist-container.component.scss'],
  standalone: true,
  imports: [IonText, IonCol, IonRow, IonImg],
})
export class ArtistContainerComponent {
  @Input() artist: IArtist;
  private router = inject(Router);
  constructor() {}

  redirectToArtist() {
    this.router.navigate(['/home/artist-page/' + this.artist.userId]);
  }
}
