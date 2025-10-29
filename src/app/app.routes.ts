import { SongManagementPage } from './pages/song-management/song-management.page';
import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  {
    // Delete
    path: 'auth',
    loadComponent: () =>
      import('./layouts/auth/auth.page').then((m) => m.AuthPage),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register/register.page').then((m) => m.RegisterPage),
      },
    ],
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/accueil/accueil.page').then((m) => m.AccueilPage),
    children: [
      {
        path: 'play-song',
        loadComponent: () =>
          import('./shared/modal/play-song/play-song.page').then(
            (m) => m.PlaySongPage,
          ),
      },
      {
        path: 'album/:id',
        loadComponent: () =>
          import('./pages/album/album.page').then((m) => m.AlbumPage),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage).then(),
      },
      {
        path: 'playlistes',
        loadComponent: () =>
          import('./pages/playlistes/playlistes.page')
            .then((m) => m.PlaylistesPage)
            .then(),
      },
      {
        path: 'favorite',
        loadComponent: () =>
          import('./pages/favorie/favorie.page').then((m) => m.FavoriePage),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./pages/account/account/account.page').then(
            (m) => m.AccountPage,
          ),
      },
      {
        path: 'playlist/:id',
        loadComponent: () =>
          import('./pages/playlist/playlist.page').then((m) => m.PlaylistPage),
      },
      {
        path: 'artist-page/:id',
        loadComponent: () =>
          import('./pages/artist-page/artist-page.page').then(
            (m) => m.ArtistPagePage,
          ),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./pages/search/search.page').then((m) => m.SearchPage),
      },
      {
        path: 'edit-profile',
        loadComponent: () =>
          import('./pages/edit-profile/edit-profile.page').then(
            (m) => m.EditProfilPage,
          ),
      },
      {
        path: 'settings-menu',
        loadComponent: () =>
          import('./pages/settings-menu/settings-menu.page').then(
            (m) => m.SettingsMenuPage,
          ),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./pages/settings/account/account.page').then(
            (m) => m.AccountPage,
          ),
      },
      {
        path: 'languages',
        loadComponent: () =>
          import('./pages/settings/languages/languages.page').then(
            (m) => m.LanguagesPage,
          ),
      },
      {
        path: 'notification',
        loadComponent: () =>
          import('./pages/settings/notification/notification.page').then(
            (m) => m.NotificationPage,
          ),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/settings/about/about.page').then((m) => m.AboutPage),
      },
      {
        path: 'new-song',
        loadComponent: () =>
          import('./pages/new-song/new-song.page').then((m) => m.NewSongPage),
      },
      {
        path: 'last-played',
        loadComponent: () =>
          import('./pages/last-played/last-played.page').then(
            (m) => m.LastPlayedPage,
          ),
      },
      {
        path: 'top-songs',
        loadComponent: () =>
          import('./pages/top-songs/top-songs.page').then(
            (m) => m.TopSongsPage,
          ),
      },
      {
        path: 'music-genre',
        loadComponent: () =>
          import('./pages/music-genre/music-genre.page').then(
            (m) => m.MusicGenrePage,
          ),
      },
      {
        path: 'song-management',
        loadComponent: () =>
          import('./pages/song-management/song-management.page').then(
            (m) => m.SongManagementPage,
          ),
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
];
