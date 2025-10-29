import { Component, OnInit } from '@angular/core';
import { IonIcon, IonButtons, IonBackButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-search-button',
  templateUrl: './search-button.component.html',
  styleUrls: ['./search-button.component.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons, IonIcon],
})
export class SearchButtonComponent {
  constructor() {}
}
