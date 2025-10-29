import { IonIcon, IonText } from '@ionic/angular/standalone';
import { Component, Input, OnInit, Output } from '@angular/core';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { IFilter } from 'src/app/core/interfaces/filter';
import { addIcons } from 'ionicons';
import { checkmarkDoneOutline } from 'ionicons/icons';
import { ISong } from 'src/app/core/interfaces/song';
import { EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import * as SortActions from '../../../core/store/action/sort.action';
import { selectSortState } from 'src/app/core/store/selector/sort.selectors';
import { IPageType } from 'src/app/core/interfaces/types';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
  standalone: true,
  imports: [
    IonModal,
    IonGrid,
    IonCol,
    IonRow,
    IonAvatar,
    IonContent,
    IonTitle,
    IonButtons,
    IonToolbar,
    IonButton,
    IonHeader,
    IonItem,
    IonInput,
    IonText,
    IonIcon,
  ],
})
export class FilterModalComponent implements OnInit {
  @Input() songs: ISong[] = []; // Les chansons à trier // Page sur laquelle appliquer le tri
  @Input() page: IPageType;
  filters: IFilter[] = [
    { name: 'Titre', activate: true },
    { name: 'Artist', activate: false },
    { name: 'Album', activate: false },
  ];

  constructor(private store: Store) {}

  ngOnInit() {
    addIcons({ checkmarkDoneOutline });
    this.store.select(selectSortState).subscribe((sortState) => {
      const sort = sortState[this.page as keyof typeof sortState];
      if (!sort) return;

      const activeKeyToName: Record<string, string> = {
        title: 'Titre',
        artist: 'Artist',
        album: 'Album',
      };

      this.filters.forEach(
        (f) => (f.activate = f.name === activeKeyToName[sort.key]),
      );
    });
  }

  changeFilter(filterIndex: number) {
    console.log('🎵 Changement de filtre:', this.filters[filterIndex].name);

    // Désactive tous les filtres
    this.filters.forEach((f) => (f.activate = false));
    this.filters[filterIndex].activate = true;

    // Mapping pour transformer le nom affiché en clé du store
    const mapping: Record<string, SortActions.SortKey> = {
      Titre: 'title',
      Artist: 'artist',
      Album: 'album',
    };

    const key = mapping[this.filters[filterIndex].name] || 'title';
    console.log('🚀 Dispatch de l’action SortActions.changeSort', {
      page: this.page,
      criterion: this.filters[filterIndex].name,
    });
    // ⚡ Dispatch vers le store
    this.store.dispatch(
      SortActions.changeSort({
        page: this.page,
        criterion: this.filters[filterIndex].name as
          | 'Titre'
          | 'Artist'
          | 'Album',
      }),
    );
  }
}
