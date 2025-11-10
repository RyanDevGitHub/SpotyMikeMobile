import { Component, Input } from '@angular/core';
import { IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisVerticalOutline } from 'ionicons/icons';
import { ISong } from 'src/app/core/interfaces/song';
import { IPageType } from 'src/app/core/interfaces/types';

import { BackButtonComponent } from '../../button/back-button/back-button.component';
import { FilterOptionComponent } from '../../filter-option/filter-option.component';

@Component({
  selector: 'app-header-category',
  templateUrl: './header-category.component.html',
  styleUrls: ['./header-category.component.scss'],
  standalone: true,
  imports: [
    IonTitle,
    IonHeader,
    BackButtonComponent,
    FilterOptionComponent,
    IonToolbar,
  ],
})
export class HeaderCategoryComponent {
  @Input() title: string;
  @Input() backButton: boolean;
  @Input() songs: ISong[] = [];
  @Input() filter: boolean = true;
  @Input() page: IPageType;
  constructor() {
    addIcons({ ellipsisVerticalOutline });
  }

  openOption() {}
}
