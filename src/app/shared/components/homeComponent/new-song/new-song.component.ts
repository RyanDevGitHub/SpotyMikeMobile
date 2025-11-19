import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonRow,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-new-song', //
  templateUrl: './new-song.component.html',
  styleUrls: ['./new-song.component.scss'],
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonIcon, IonImg],
})
export class TopSongComponent {
  constructor() {}
  @Input() img: string;
  router = inject(Router);

  redirectToNewPage() {
    this.router.navigate(['/home/new-song']);
  }
}
