// Importe les fonctions de cache depuis @angular/fire/firestore
import { provideHttpClient } from '@angular/common/http';
import { enableProdMode, inject, isDevMode } from '@angular/core';
// 1. Modifie tes imports Firebase pour utiliser uniquement @angular/fire
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { Auth, getAuth, provideAuth } from '@angular/fire/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  provideFirestore,
} from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  albumsOutline,
  alertOutline,
  book,
  chatbubbleEllipsesOutline,
  chevronBackOutline,
  chevronForwardOutline,
  ellipsisHorizontalOutline,
  heartOutline,
  home,
  homeOutline,
  linkOutline,
  logoTwitter,
  logoWhatsapp,
  musicalNoteOutline,
  pauseOutline,
  personAddOutline,
  personCircleOutline,
  personOutline,
  playOutline,
  playSkipBackOutline,
  playSkipForwardOutline,
  repeatOutline,
  settingsOutline,
  shareOutline,
  shuffleOutline,
  timerOutline,
} from 'ionicons/icons';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { i18nProviders } from './app/core/providers/i18n.providers';
import { AuthService } from './app/core/services/auth.service';
import { AuthentificationService } from './app/core/services/authentification.service';
import { FirebaseAuthToken } from './app/core/services/firebase-auth.token';
import { LocalStorageService } from './app/core/services/local-storage.service';
import { AlbumEffects } from './app/core/store/effect/album.effect';
import { ArtistsEffects } from './app/core/store/effect/artist.effect';
import { FavoritesEffects } from './app/core/store/effect/favorites.effect';
import { SongEffects } from './app/core/store/effect/song.effects';
import { UserEffects } from './app/core/store/effect/user.effects';
import { albumReducer } from './app/core/store/reducer/album.reducer';
import { artistsReducer } from './app/core/store/reducer/artist.reducer';
import { favoritesReducer } from './app/core/store/reducer/favorite.reducer';
import { musicReducer } from './app/core/store/reducer/song.reducer';
import { sortReducer } from './app/core/store/reducer/sort.reducer';
import { userReducer } from './app/core/store/reducer/user.reducer';
import { environment } from './environments/environment';

// ... (tes autres imports)
if (environment.production) {
  enableProdMode();
}
addIcons({
  'alert-outline': alertOutline,

  'home-outline': homeOutline,

  'person-circle-outline': personCircleOutline,

  'play-skip-back-outline': playSkipBackOutline,

  'play-skip-forward-outline': playSkipForwardOutline,

  'ellipsis-horizontal-outline': ellipsisHorizontalOutline,

  'add-circle-outline': addCircleOutline,

  'albums-outline': albumsOutline,

  'share-outline': shareOutline,

  'person-add-outline': personAddOutline,

  'musical-notes-outline': musicalNoteOutline,

  'chevron-back-outline': chevronBackOutline,

  'timer-outline': timerOutline,

  'settings-outline': settingsOutline,

  'repeat-outline': repeatOutline,

  'shuffle-outline': shuffleOutline,

  'chevron-forward-outline': chevronForwardOutline,

  'heart-outline': heartOutline,

  'play-outline': playOutline,

  'person-outline': personOutline,

  'pause-outline': pauseOutline,

  'logo-twitter': logoTwitter,

  'chatbubble-ellipses-outline': chatbubbleEllipsesOutline,

  'logo-whatsapp': logoWhatsapp,

  'link-outline': linkOutline,

  'book': book,

  'home': home,
});
bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    i18nProviders,
    LocalStorageService,
    AuthService,
    AuthentificationService,

    // --- FIREBASE CORRIGÉ ---
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),

    provideFirestore(() => {
      // On utilise getApp() pour récupérer l'app initialisée juste au dessus
      const app = getApp();
      return initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
    }),

    provideAuth(() => getAuth()),
    {
      provide: FirebaseAuthToken,
      useFactory: () => inject(Auth),
    },
    provideStorage(() => getStorage()),

    // --- NGRX & WORKER ---
    provideStore({
      music: musicReducer,
      user: userReducer,
      favorites: favoritesReducer,
      albums: albumReducer,
      artists: artistsReducer,
      sort: sortReducer,
    }),
    provideEffects([
      SongEffects,
      UserEffects,
      FavoritesEffects,
      AlbumEffects,
      ArtistsEffects,
    ]),
    provideStoreDevtools({
      connectInZone: false,
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
});
