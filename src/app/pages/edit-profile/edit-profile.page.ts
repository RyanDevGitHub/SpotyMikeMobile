import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppState } from '@capacitor/app';
import { LoadingController, ToastController } from '@ionic/angular';
import {
  IonAvatar,
  IonCol,
  IonContent,
  IonInput,
  IonItem,
  IonRow,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';
import { IUser, IUserUpdateDataBase } from 'src/app/core/interfaces/user';
import { updateUser } from 'src/app/core/store/action/user.action';
import {
  selectUser,
  selectUserState,
} from 'src/app/core/store/selector/user.selector';
import { HeaderSettingComponent } from 'src/app/shared/components/headers/header-setting/header-setting.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [
    IonCol,
    IonContent,
    CommonModule,
    FormsModule,
    HeaderSettingComponent,
    IonAvatar,
    IonRow,
    IonItem,
    IonInput,
    IonSelectOption,
    IonSelect,
  ],
})
export class EditProfilPage implements OnInit {
  store = inject(Store<AppState>);
  user$ = this.store.select(selectUser);
  firstName: string;
  lastName: string;
  email: string;
  sexe: '0' | '1' | '2';
  tel: string;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    console.log('User data:', this.user$);
    this.user$
      .pipe(
        take(1),
        filter((user): user is IUser => !!user),
      )
      .subscribe((user) => {
        this.firstName = user.firstName ?? '';
        this.lastName = user.lastName ?? '';
        this.email = user.email ?? '';
        this.sexe = (user.sexe as '0' | '1' | '2') ?? '2';
        this.tel = user.tel ?? '';
      });
    console.log(this.firstName, this.lastName, this.email, this.sexe, this.tel);
  }
  onChildSave(data: boolean) {
    console.log('[Parent] Received save data:', data);

    const updatedData: IUserUpdateDataBase = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      sexe: this.sexe,
      tel: this.tel,
    };

    this.user$.pipe(take(1)).subscribe(async (user) => {
      if (!user) return;

      // 1️⃣ Afficher loader
      const loading = await this.presentLoading('Mise à jour en cours...');

      // 2️⃣ Dispatch action pour update
      this.store.dispatch(
        updateUser({ userId: user.id, changes: updatedData }),
      );

      // 3️⃣ Ecouter le succès / échec via store
      this.store
        .select(selectUserState) // Crée un selector pour loading/error si tu n'as pas
        .pipe(
          filter((state) => !state.loading), // Quand le loading devient false
          take(1),
        )
        .subscribe(async (state) => {
          await loading.dismiss(); // Masquer le loader
          if (!state.error) {
            this.presentToast('Vos modifications ont bien été appliquées !');
          } else {
            this.presentToast('Erreur lors de la mise à jour.', 5000);
          }
        });
    });
  }

  async presentLoading(message: string = 'Veuillez patienter...') {
    const loading = await this.loadingCtrl.create({
      message,
      spinner: 'circles',
    });
    await loading.present();
    return loading; // On retourne le loader pour le dismiss plus tard
  }

  async presentToast(message: string, duration: number = 2000) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position: 'top',
      color: 'success',
    });
    toast.present();
  }
}
