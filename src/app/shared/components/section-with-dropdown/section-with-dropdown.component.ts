import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import {
  InfiniteScrollCustomEvent,
  IonCol,
  IonContent,
  IonGrid,
  IonList,
  IonRow,
} from '@ionic/angular/standalone';
import { PlayPageType } from 'src/app/core/interfaces/play-page-type';

import { SeeAllComponent } from '../button/see-all/see-all.component';
import { MusicContainerComponent } from '../containers/music-container/music-container.component';
import { PlaylistContainerComponent } from '../containers/playlist-container/playlist-container.component';
import { PlayContext } from './../../../core/interfaces/play-page-type';

@Component({
  selector: 'app-section-with-dropdown',
  standalone: true,
  templateUrl: './section-with-dropdown.component.html',
  styleUrls: ['./section-with-dropdown.component.scss'],
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    SeeAllComponent,
    IonContent,
    IonList,
    PlaylistContainerComponent,
    MusicContainerComponent,
  ],
})
export class SectionWithDropdownComponent {
  constructor() {
    this.playContext = { type: this.pageType };
  }
  private router = inject(Router);
  @Input() type: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() items: any[];
  @Input() title: string;
  @Input() redirectTo: string;
  @Input() component: string;
  @Input() pageType: PlayPageType;
  playContext: PlayContext;

  private generateItems() {
    if (Array.isArray(this.items)) {
      const count = this.items.length + 1;
      for (let i = 0; i < 50; i++) {
        this.items.push(`Item ${count + i}`);
      }
    }
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
