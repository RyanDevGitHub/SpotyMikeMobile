// Imports des services de l'application
import { provideHttpClient } from '@angular/common/http';
// Imports Angular/Ionic de base
import { enableProdMode, inject } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
// Imports AngularFire (les modules natifs sont maintenant gérés par ceux-ci)
import { Auth, getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { provideEffects } from '@ngrx/effects';
// Imports NGRX
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
// Imports Ionicons
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  albumsOutline,
  alertOutline,
  chevronBackOutline,
  chevronForwardOutline,
  ellipsisHorizontalOutline,
  heartOutline,
  homeOutline,
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
    // Correction : retrait du double de provideStoreDevtools
    provideStoreDevtools({
      connectInZone: false,
    }),
  ],
});
