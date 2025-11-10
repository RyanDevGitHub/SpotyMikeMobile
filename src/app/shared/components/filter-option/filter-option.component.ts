import { Component, inject, Input, OnInit } from '@angular/core';
import { IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisVerticalOutline } from 'ionicons/icons';
import { ISong } from 'src/app/core/interfaces/song';
import { IPageType } from 'src/app/core/interfaces/types';

import { FilterModalComponent } from '../../modal/filter-modal/filter-modal.component';

@Component({
  selector: 'app-filter-option',
  templateUrl: './filter-option.component.html',
  styleUrls: ['./filter-option.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton],
})
export class FilterOptionComponent implements OnInit {
  constructor() {}

  ctrlModal = inject(ModalController);
  @Input() songs: ISong[] = [];
  @Input() page: IPageType;
  ngOnInit() {
    addIcons({ ellipsisVerticalOutline });
  }

  async openFilter() {
    const modal = await this.ctrlModal.create({
      component: FilterModalComponent,
      componentProps: {
        songs: this.songs, // <-- le tableau de chansons à trier
        page: this.page, // <-- la page actuelle
      },
      initialBreakpoint: 1,
      breakpoints: [0, 1],
      cssClass: 'custom-modal-filter',
    });

    // Récupérer les chansons triées quand le modal est dismiss
    modal.onDidDismiss().then((result) => {
      if (result.data?.sortedSongs) {
        // Mettre à jour le tableau dans la page
        this.songs = result.data.sortedSongs;
      }
    });

    modal.present();
  }
}
