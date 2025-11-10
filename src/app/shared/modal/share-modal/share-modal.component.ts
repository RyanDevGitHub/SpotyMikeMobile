import { Component, Input } from '@angular/core';
import { IonAvatar, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  standalone: true,
  styleUrls: ['./share-modal.component.scss'],
  imports: [IonCol, IonAvatar, IonRow, IonGrid],
})
export class ShareModalComponent {
  constructor() {}
  @Input() id: string;
}
