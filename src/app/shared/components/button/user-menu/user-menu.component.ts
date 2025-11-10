import { Component, OnInit } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  standalone: true,
  imports: [IonIcon, IonContent],
})
export class UserMenuComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    addIcons({
      personCircleOutline,
    });
  }
}
