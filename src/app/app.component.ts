import { AuthService } from './core/services/auth.service';
import { MusicServiceService } from './core/services/music-service.service';
import { musicReducer } from './core/store/reducer/song.reducer';
import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone'; // <-- Importez Platform et ses composants standalone
import { TranslateService } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { environment } from 'src/environments/environment';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private translate = inject(TranslateService);
  // Injectez Platform ici
  constructor(
    private audioService: MusicServiceService,
    private platform: Platform, // <-- Ajout de l'injection de Platform
    private authService: AuthService,
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
      const info = await StatusBar.getInfo();
      await StatusBar.setBackgroundColor({ color: '#000000' });
      await StatusBar.setStyle({ style: Style.Light });
      await EdgeToEdge.enable();
      // 2. Maintenant, 'info' est de type StatusBarInfo (et non une Promise).
      console.log('Informations de la Status Bar :');
      console.log(info);

      // Vous pouvez accéder à ses propriétés :
      // console.log("Hauteur de la Status Bar:", info.height);
    } catch (error) {
      console.error('Erreur lors de la récupération des infos:', error);
    }
  }
  ngOnInit(): void {
    // Les traductions et autres initialisations non dépendantes de la plateforme native restent ici
    this.translate.use('fr_FR');
    this.translate.setDefaultLang('fr_FR');
    this.initializeSocialLogin();
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('StatusBar')) {
        this.setStatusBarStyleDark();
        this.logStatusBarInfo();
        // Demande au WebView de ne PAS chevaucher la barre de statut.
        // Cela force le contenu de l'application à s'afficher en dessous de la barre de statut.
        // StatusBar.setOverlaysWebView({ overlay: false });
        // StatusBar.setStyle({ style: Style.Dark });

        // Optionnel : vous pouvez aussi définir le style de la barre de statut
        // StatusBar.setStyle({ style: Style.Default });
      }
    });
    // Si StoreModule n'est pas déjà configuré via app.config.ts ou ailleurs, vous pouvez le laisser ici
    StoreModule.forRoot({ music: musicReducer });
  }
}
