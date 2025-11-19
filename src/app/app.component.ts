import { Component, inject, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone'; // <-- Importez Platform et ses composants standalone
import { Store, StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

import { AuthService } from './core/services/auth.service';
import { MusicServiceService } from './core/services/music-service.service';
import { initializeAuth } from './core/store/action/user.action';
import { AppState } from './core/store/app.state';
import { musicReducer } from './core/store/reducer/song.reducer';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private translate = inject(TranslateService);
  store = inject(Store<AppState>);
  // Injectez Platform ici
  constructor(
    private audioService: MusicServiceService,
    private platform: Platform, // <-- Ajout de l'injection de Platform
    private authService: AuthService
  ) {}

  // Logique déplacée/modifiée

  async initializeSocialLogin() {
    // Le plugin recommande de le faire "tôt"
    await SocialLogin.initialize({
      google: {
        // ⭐ Le webClientId est obligatoire pour le mode web (ionic serve) et Android
        webClientId: environment.firebaseConfig.webClientId,
        mode: 'online',
      },
      // Ajoutez vos configs Apple, Facebook ici si nécessaire
    });
  }
  setStatusBarStyleDark = async () => {
    await StatusBar.setStyle({ style: Style.Dark });
  };

  async logStatusBarInfo() {
    try {
      // 1. Utilisez 'await' pour attendre que la Promise se résolve.
      // const info = await StatusBar.getInfo();
      await StatusBar.setBackgroundColor({ color: '#000000' });
      await StatusBar.setStyle({ style: Style.Light });
      await EdgeToEdge.enable();
      // 2. Maintenant, 'info' est de type StatusBarInfo (et non une Promise).
      console.log('Informations de la Status Bar :');
      // console.log(info);

      // Vous pouvez accéder à ses propriétés :
      // console.log("Hauteur de la Status Bar:", info.height);
    } catch (error) {
      console.error('Erreur lors de la récupération des infos:', error);
    }
  }
  ngOnInit(): void {
    console.log('[App] ngOnInit triggered');
    this.translate.use('fr_FR');
    this.translate.setDefaultLang('fr_FR');
    this.initializeSocialLogin();

    this.platform.ready().then(() => {
      console.log('[App] Platform ready');

      if (Capacitor.isPluginAvailable('StatusBar')) {
        this.setStatusBarStyleDark();
        this.logStatusBarInfo();
      }
    });

    console.log('[App] Dispatching initializeAuth');
    this.store.dispatch(initializeAuth());

    console.log('[App] StoreModule configuration (if needed)');
    StoreModule.forRoot({ music: musicReducer });
  }
}
