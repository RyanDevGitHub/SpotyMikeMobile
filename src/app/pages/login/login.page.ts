import { IUser } from './../../core/interfaces/user';
import { Firebase } from '../../core/services/firebase.service';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonAvatar,
  ToastController,
  IonSpinner,
} from '@ionic/angular/standalone';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
import { TranslateModule } from '@ngx-translate/core';
import {
  LoginRequestError,
  LoginRequestSuccess,
} from 'src/app/core/interfaces/login';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import { PasswordLostComponent } from 'src/app/shared/modal/password-lost/password-lost.component';
import { LocalStorageService } from 'src/app/core/services/local-strorage.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { timeout } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { log } from 'console';
import { login, loginFailure, loginSuccess } from 'src/app/core/store/action/user.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonSpinner,
    IonAvatar,
    IonIcon,
    IonItem,
    IonList,
    IonTitle,
    IonInput,
    IonHeader,
    IonButton,
    IonToolbar,
    IonContent,
    FormsModule,
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
})
export class LoginPage implements OnInit {
  error = '';
  submitForm = false;

  private localStore = inject(LocalStorageService);
  private router = inject(Router);
  private modalCtl = inject(ModalController);
  private serviceAuth = inject(AuthentificationService);
  private toastCtrl = inject(ToastController);
  private store = inject(Store<AppState>);

  form: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor() {}
  ngOnInit() {
    window.addEventListener('offline', () => {
      this.showNetworkToast();
    });
  }
  onSubmit() {
    this.error = '';

    // Vérification connexion réseau
    if (!navigator.onLine) {
      this.showNetworkToast();
      return;
    }

    if (!this.form.valid) return;

    this.submitForm = true;

    this.store.dispatch(
      login({
        email: this.form.value.email,
        password: this.form.value.password,
      })
    );
  }

  async showNetworkToast() {
    const toast = await this.toastCtrl.create({
      message: 'Impossible de se connecter au serveur, réessayez plus tard',
      color: 'danger',
      duration: 3000,
      position: 'top',
    });
    await toast.present();
  }

  async onPasswordLostModal() {
    const modal = await this.modalCtl.create({
      component: PasswordLostComponent,
    });
    modal.present();
  }

  loginWithGoogle() {
    this.error = '';
    this.submitForm = true;

    this.serviceAuth.signInWithGoogle().subscribe((result) => {
      this.submitForm = false;
      if (result.type === 'success') {
        this.store.dispatch(
          loginSuccess({ user: result.user, token: result.token })
        );
      } else {
        this.error = result.message;
        this.store.dispatch(loginFailure({ error: result.message }));
      }
    });
  }
}
