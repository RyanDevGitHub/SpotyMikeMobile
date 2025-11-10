import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  InputCustomEvent,
  IonCol,
  IonGrid,
  IonInput,
  IonRow,
  IonText,
  SearchbarInputEventDetail,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';

import { BackButtonComponent } from '../button/back-button/back-button.component';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss'],
  standalone: true,
  imports: [IonGrid, IonCol, IonRow, IonInput, IonText, BackButtonComponent],
})
export class ResearchComponent implements OnInit {
  constructor() {}
  private router = inject(Router);
  @Output() searchChange = new EventEmitter<string>();

  ngOnInit() {
    addIcons({ searchOutline });
  }
  returnHome() {
    this.router.navigate(['/home/home']);
  }

  onSearchChange(event: InputCustomEvent<SearchbarInputEventDetail>) {
    const term = event.target.value || '';
    // console.log('[DEBUG] app-research: Term emitted:', term);
    this.searchChange.emit(term as string); // Émet le terme de recherche
  }
}
