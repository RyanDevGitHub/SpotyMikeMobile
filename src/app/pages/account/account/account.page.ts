import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppState } from '@capacitor/app';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonRow,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import {
  selectUser,
  selectUserPlaylists,
} from 'src/app/core/store/selector/user.selector';
import { HeaderCategoryComponent } from 'src/app/shared/components/headers/header-category/header-category.component';
import { SectionWithDropdownComponent } from 'src/app/shared/components/section-with-dropdown/section-with-dropdown.component';

import { ProfilInfoComponent } from '../../../shared/components/profilComponent/profil-info/profil-info.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonGrid,
    IonContent,
    CommonModule,
    FormsModule,
    IonCol,
    IonRow,
    SectionWithDropdownComponent,
    ProfilInfoComponent,
    HeaderCategoryComponent,
    AsyncPipe,
  ],
})
export class AccountPage implements OnDestroy {
  public isModalOpen: boolean;
  private modalSubscription: Subscription;
  private localStorageService = inject(LocalStorageService);
  store = inject(Store<AppState>);
  user$ = this.store.select(selectUser);
  items = this.store.select(selectUserPlaylists);
  constructor(
    private router: Router,
    private modalStateService: ModalStateService,
  ) {
    this.modalSubscription = modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value),
    );
  }

  editProfile() {
    this.router.navigate(['home/edit-profile']);
  }

  songManagement() {
    this.router.navigate(['home/song-management']);
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }
}
