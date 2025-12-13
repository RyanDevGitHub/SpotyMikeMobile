import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AppState } from '@capacitor/app';
import { SocialLogin } from '@capgo/capacitor-social-login';
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonSpinner,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Auth } from 'firebase/auth';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
// CORRECTION : Importation du jeton depuis le fichier dédié
import { FirebaseAuthToken } from 'src/app/core/services/firebase-auth.token';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { login } from 'src/app/core/store/action/user.action';
import { PasswordLostComponent } from 'src/app/shared/modal/password-lost/password-lost.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonSpinner,
    IonIcon,
    IonItem,
    IonList,
    IonInput,
    IonButton,
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
  private toastCtrl = inject(ToastController); // CORRECTION : Injection via le jeton explicite (FirebaseAuthToken)
  private auth: Auth = inject(FirebaseAuthToken);
  private store = inject(Store<AppState>);
  private authService = inject(AuthService);

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
  async ngOnInit() {
    window.addEventListener('offline', () => {
      this.showNetworkToast();
    });
    this.handleWebRedirect();
  }
  handleWebRedirect() {
    // Si l'URL contient les paramètres de redirection d'OAuth, le plugin les traitera
    // et tentera de clore le flux, résolvant ou rejetant l'appel login initial.
    SocialLogin.isLoggedIn({ provider: 'google' }).catch((e) => {
      // En mode Web, cette promesse est souvent ignorée ou peut renvoyer une erreur
      // si le plugin ne trouve pas de token, mais l'appel est nécessaire.
      console.warn(
        'Redirect Handler executed (ignore si non en cours de login):',
        e
      );
    });
  }
  onSubmit() {
    this.error = ''; // Vérification connexion réseau

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

  async loginWithGoogle() {
    //User Authentication
    this.signInWithGoogle();
    // this.serviceAuth.signInWithGoogle();
  }

  async signInWithGoogle() {
    SocialLogin.initialize({
      google: {
        webClientId: environment.firebaseConfig.webClientId,
        mode: 'online',
      },
    }).catch(() => {
      // Ignore any errors, this is just to handle the redirect
    });
    try {
      // 💡 2. C'est l'appel qui déclenche l'ouverture du pop-up/redirection.
      const res = await SocialLogin.login({
        provider: 'google',
        options: {},
      });

      // La promesse se résout une fois que le 'Redirect Handler' (ci-dessus) a terminé son travail.
      if (res) {
        // Étape 3 : Échange du token avec Firebase, comme dans l'exemple initial.
        // ...
        console.log('Google login successful, token:', res);
        const authCodeResult = await SocialLogin.getAuthorizationCode({
          provider: 'google',
        });
        this.authService.exchangeTokenWithFirebase(authCodeResult.jwt!);
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  }
}
