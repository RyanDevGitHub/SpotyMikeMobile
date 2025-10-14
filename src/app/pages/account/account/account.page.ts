import { LocalStorageService } from 'src/app/core/services/local-strorage.service';
import { ProfilInfoComponent } from '../../../shared/components/profilComponent/profil-info/profil-info.component';
import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonCol,
  IonRow,
  IonAvatar,
  IonText,
  IonButton,
} from '@ionic/angular/standalone';
import { SectionWithDropdownComponent } from 'src/app/shared/components/section-with-dropdown/section-with-dropdown.component';
import { Router } from '@angular/router';
import { IPlaylist } from 'src/app/core/interfaces/playlistes';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { Subscription } from 'rxjs';
import { HeaderCategoryComponent } from 'src/app/shared/components/headers/header-category/header-category.component';
import { IUser } from 'src/app/core/interfaces/user';
import { AppState } from '@capacitor/app';
import { Store } from '@ngrx/store';
import { loadUser } from 'src/app/core/store/action/user.action';
import {
  selectUser,
  selectUserPlaylists,
} from 'src/app/core/store/selector/user.selector';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonText,
    IonAvatar,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
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
export class AccountPage {
  public isModalOpen: boolean;
  private modalSubscription: Subscription;
  private localStorageService = inject(LocalStorageService);
  store = inject(Store<AppState>);
  user$ = this.store.select(selectUser);
  items = this.store.select(selectUserPlaylists);
  constructor(
    private router: Router,
    private modalStateService: ModalStateService
  ) {
    this.modalSubscription = modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value)
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
