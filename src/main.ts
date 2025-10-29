// Imports des services de l'application
import { AuthentificationService } from './app/core/services/authentification.service';
import { FirebaseAuthToken } from './app/core/services/firebase-auth.token';
import { AuthService } from './app/core/services/auth.service';

// Imports Angular/Ionic de base
import { enableProdMode, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { i18nProviders } from './app/core/providers/i18n.providers';
import { LocalStorageService } from './app/core/services/local-strorage.service';

// Imports AngularFire (les modules natifs sont maintenant gérés par ceux-ci)
import { provideAuth, getAuth, Auth } from '@angular/fire/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideStorage, getStorage } from '@angular/fire/storage';
import {
  provideFirestore,
  getFirestore,
  Firestore,
} from '@angular/fire/firestore';

// Imports NGRX
import { provideStore } from '@ngrx/store';
import { musicReducer } from './app/core/store/reducer/song.reducer';
import { provideEffects } from '@ngrx/effects';
import { SongEffects } from './app/core/store/effect/song.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { userReducer } from './app/core/store/reducer/user.reducer';
import { UserEffects } from './app/core/store/effect/user.effects';
import { favoritesReducer } from './app/core/store/reducer/favorite.reducer';
import { FavoritesEffects } from './app/core/store/effect/favorites.effect';
import { albumReducer } from './app/core/store/reducer/album.reducer';
import { AlbumEffects } from './app/core/store/effect/album.effect';
import { ArtistsEffects } from './app/core/store/effect/artist.effect';
import { artistsReducer } from './app/core/store/reducer/artist.reducer';
import { sortReducer } from './app/core/store/reducer/sort.reducer';

// Imports Ionicons
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  albumsOutline,
  alertOutline,
  chevronBack,
  chevronBackOutline,
  chevronForward,
  chevronForwardOutline,
  ellipsisHorizontalOutline,
  heartOutline,
  homeOutline,
  musicalNoteOutline,
  personAddOutline,
  personCircleOutline,
  personOutline,
  playOutline,
  playSkipBackOutline,
  playSkipForwardOutline,
  repeatOutline,
  settings,
  settingsOutline,
  shareOutline,
  shuffleOutline,
  timerOutline,
} from 'ionicons/icons';
import { repeat, timer } from 'rxjs';

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
});

bootstrapApplication(AppComponent, {
  providers: [
    // --- FOURNISSEURS DE BASE (Doivent être en haut) ---
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    // --- FOURNISSEURS GLOBALS ---
    i18nProviders,
    LocalStorageService,
    AuthService,
    AuthentificationService,

    // --- FIREBASE ---
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    {
      // Mappe l'instance AngularFire Auth sur notre jeton explicite
      provide: FirebaseAuthToken,
      useFactory: () => inject(Auth),
    },
    provideStorage(() => getStorage()),

    // --- NGRX / STORE ---
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
    // Correction : Retrait du doublon de provideStoreDevtools
    provideStoreDevtools({
      connectInZone: false,
    }),
  ],
});
