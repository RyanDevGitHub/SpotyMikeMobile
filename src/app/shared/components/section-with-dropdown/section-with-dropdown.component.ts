import { Component, inject, Input, OnInit, Type } from '@angular/core';
import {
  IonCol,
  IonGrid,
  IonRow,
  IonContent,
  IonList,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
} from '@ionic/angular/standalone';
import { SeeAllComponent } from '../button/see-all/see-all.component';
import { PlaylistContainerComponent } from '../containers/playlist-container/playlist-container.component';
import { MusicContainerComponent } from '../containers/music-container/music-container.component';
import { Router } from '@angular/router';

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
    IonImg,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    PlaylistContainerComponent,
    MusicContainerComponent,
  ],
})
export class SectionWithDropdownComponent {
  constructor() {}
  private router = inject(Router);
  @Input() type: any;
  @Input() items: any;
  @Input() title: string;
  @Input() redirectTo: string;
  @Input() component: string;

  private generateItems() {
    const count = this.items.length + 1;
    for (let i = 0; i < 50; i++) {
      this.items.push(`Item ${count + i}`);
    }
  }

  onIonInfinite(ev: any) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
