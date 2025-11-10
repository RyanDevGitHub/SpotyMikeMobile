import { Component, Input } from '@angular/core';
import {
  IonAvatar,
  IonCol,
  IonGrid,
  IonRow,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { IUser } from 'src/app/core/interfaces/user';

@Component({
  selector: 'app-profil-info',
  templateUrl: './profil-info.component.html',
  styleUrls: ['./profil-info.component.scss'],
  standalone: true,
  imports: [IonSkeletonText, IonAvatar, IonGrid, IonRow, IonCol],
})
export class ProfilInfoComponent {
  @Input() user$: IUser | null;
  constructor() {}
}
