import { MinimizePlayerAudioService } from './app/core/services/minimize-player-audio.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
import { AuthService } from './app/core/services/auth.service';
import { enableProdMode, importProvidersFrom } from '@angular/core';
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
import { Firebase } from './app/core/services/firebase.service';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { provideStore, StoreModule } from '@ngrx/store';
import { musicReducer } from './app/core/store/reducer/song.reducer';
import { provideEffects } from '@ngrx/effects';
import { SongEffects } from './app/core/store/effect/song.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { userReducer } from './app/core/store/reducer/user.reducer';
import { UserEffects } from './app/core/store/effect/user.effects';
import { IonicModule } from '@ionic/angular';
import { MusicControls } from '@awesome-cordova-plugins/music-controls/ngx';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  albumsOutline,
  alertOutline,
  ellipsisHorizontalOutline,
  homeOutline,
  musicalNoteOutline,
  personAddOutline,
  personCircleOutline,
  playSkipBackOutline,
  playSkipForwardOutline,
  shareOutline,
} from 'ionicons/icons';
import { favoritesReducer } from './app/core/store/reducer/favorite.reducer';
import { FavoritesEffects } from './app/core/store/effect/favorites.effect';
import { albumReducer } from './app/core/store/reducer/album.reducer';
import { AlbumEffects } from './app/core/store/effect/album.effect';
import { ArtistsEffects } from './app/core/store/effect/artist.effect';
import { artistsReducer } from './app/core/store/reducer/artist.reducer';
import { sortReducer } from './app/core/store/reducer/sort.reducer';
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
});

bootstrapApplication(AppComponent, {
  providers: [
    i18nProviders,
    provideHttpClient(),
    LocalStorageService,
    Firebase,
    AuthService,
    AuthentificationService,
    MinimizePlayerAudioService,
    AngularFireAuth,
    provideStore({
      music: musicReducer,
      user: userReducer,
      favorites: favoritesReducer,
      albums: albumReducer,
      artists: artistsReducer,
      sort: sortReducer, // Enregistrez votre reducer ici
    }),
    provideEffects([
      SongEffects,
      UserEffects,
      FavoritesEffects,
      AlbumEffects,
      ArtistsEffects,
    ]),
    provideStoreDevtools(),
    provideIonicAngular(),
    provideStoreDevtools({
      connectInZone: false,
    }),
    provideRouter(routes),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
  ],
});
