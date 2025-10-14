import { Component, Input, OnInit } from '@angular/core';
import {
  IonCol,
  IonGrid,
  IonHeader,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { BackButtonComponent } from '../../button/back-button/back-button.component';
import { FilterOptionComponent } from '../../filter-option/filter-option.component';
import { addIcons } from 'ionicons';
import { ellipsisVerticalOutline } from 'ionicons/icons';
import { ISong } from 'src/app/core/interfaces/song';
import { IPageType } from 'src/app/core/interfaces/types';

@Component({
  selector: 'app-header-category',
  templateUrl: './header-category.component.html',
  styleUrls: ['./header-category.component.scss'],
  standalone: true,
  imports: [
    IonTitle,
    IonHeader,
    IonGrid,
    IonCol,
    IonRow,
    BackButtonComponent,
    IonText,
    FilterOptionComponent,
    IonToolbar,
  ],
})
export class HeaderCategoryComponent implements OnInit {
  @Input() title: string;
  @Input() backButton: boolean;
  @Input() songs: ISong[] = [];
  @Input() filter: boolean = true;
  @Input() page: IPageType;
  constructor() {
    addIcons({ ellipsisVerticalOutline });
  }

  ngOnInit() {}

  openOption() {}
}
