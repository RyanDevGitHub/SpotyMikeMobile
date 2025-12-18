import { Component, Input, OnInit } from '@angular/core';
import {
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { addIcons } from 'ionicons';
import { checkmarkDoneOutline } from 'ionicons/icons';
import { IFilter } from 'src/app/core/interfaces/filter';
import { ISong } from 'src/app/core/interfaces/song';
import { IPageType } from 'src/app/core/interfaces/types';
import { selectSortState } from 'src/app/core/store/selector/sort.selectors';

import * as SortActions from '../../../core/store/action/sort.action';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
  standalone: true,
  imports: [IonGrid, IonCol, IonRow, IonText, IonIcon],
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
        (f) => (f.activate = f.name === activeKeyToName[sort.key])
      );
    });
  }

  changeFilter(filterIndex: number) {
    console.log('🎵 Changement de filtre:', this.filters[filterIndex].name);

    // Désactive tous les filtres
    this.filters.forEach((f) => (f.activate = false));
    this.filters[filterIndex].activate = true;

    // Mapping pour transformer le nom affiché en clé du store
    // const mapping: Record<string, SortActions.SortKey> = {
    //   Titre: 'title',
    //   Artist: 'artist',
    //   Album: 'album',
    // };

    // const key = mapping[this.filters[filterIndex].name] || 'title';
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
      })
    );
  }
}
