import { Component } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-search-button',
  templateUrl: './search-button.component.html',
  styleUrls: ['./search-button.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class SearchButtonComponent {
  constructor() {}
}
