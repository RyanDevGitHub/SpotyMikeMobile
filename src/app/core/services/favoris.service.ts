import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  combineLatest,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';

import { IAlbum } from '../interfaces/album';
import { ISong } from '../interfaces/song';
import { selectAllAlbums } from '../store/selector/album.selector';
import { selectAllSongs } from '../store/selector/song.selector';
import { UserRepositoryService } from './repositories/user-repository.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  // 🔹 Stockage local pour persistance
  private storageKeySongs = 'mesFavorisSongs';
  private storageKeyAlbums = 'mesFavorisAlbums';

  // 🔹 Signaux internes / BehaviorSubjects
  private favorisSongs$ = new BehaviorSubject<ISong[]>([]);
  private favorisAlbums$ = new BehaviorSubject<IAlbum[]>([]);

  constructor(
    private store: Store,
    private userRepo: UserRepositoryService,
  ) {
    this.loadFromStorage();
  }

  // ==========================
  // 🔹 CHARGEMENT FAVORIS
  // ==========================
  getUserFavorites(
    userId?: string,
  ): Observable<{ songs: ISong[]; albums: IAlbum[] }> {
    if (!userId) return of({ songs: [], albums: [] });

    return from(this.userRepo.getUserById(userId)).pipe(
      switchMap((user) =>
        combineLatest([
          this.store.select(selectAllSongs).pipe(take(1)),
          this.store.select(selectAllAlbums).pipe(take(1)),
        ]).pipe(
          map(([allSongs, allAlbums]) => {
            const favoriteSongIds = user?.favorites?.songs || [];
            const favoriteAlbumIds = user?.favorites?.albums || [];

            const favoriteSongs = allSongs.filter((s) =>
              favoriteSongIds.includes(s.id),
            );
            const favoriteAlbums = allAlbums.filter((a) =>
              favoriteAlbumIds.includes(a.id),
            );

            return { songs: favoriteSongs, albums: favoriteAlbums };
          }),
        ),
      ),
    );
  }

  // ==========================
  // 🔹 AJOUTER FAVORI
  // ==========================
  async addFavorite(
    userId: string,
    type: 'song' | 'album',
    item: ISong | IAlbum,
  ) {
    const user = await this.userRepo.getUserById(userId);
    if (!user) throw new Error('Utilisateur non trouvé');

    if (!user.favorites) user.favorites = { songs: [], albums: [] };

    const targetArray =
      type === 'song' ? user.favorites.songs : user.favorites.albums;
    if (!targetArray.includes(item.id)) targetArray.push(item.id);

    await this.userRepo.updateUser(userId, { favorites: user.favorites });

    // 🔹 Mettre à jour le store / BehaviorSubject
    if (type === 'song') {
      const updated = [...this.favorisSongs$.value, item as ISong];
      this.favorisSongs$.next(updated);
      this.updateStorageSongs(updated);
    } else {
      const updated = [...this.favorisAlbums$.value, item as IAlbum];
      this.favorisAlbums$.next(updated);
      this.updateStorageAlbums(updated);
    }

    console.log(`✅ Favori ${type} ajouté :`, item.id);
  }

  // ==========================
  // 🔹 SUPPRIMER FAVORI
  // ==========================
  async removeFavorite(userId: string, type: 'song' | 'album', id: string) {
    const user = await this.userRepo.getUserById(userId);
    if (!user || !user.favorites) return;

    const targetArray =
      type === 'song' ? user.favorites.songs : user.favorites.albums;
    user.favorites[type === 'song' ? 'songs' : 'albums'] = targetArray.filter(
      (fav) => fav !== id,
    );

    await this.userRepo.updateUser(userId, { favorites: user.favorites });

    if (type === 'song') {
      const updated = this.favorisSongs$.value.filter((s) => s.id !== id);
      this.favorisSongs$.next(updated);
      this.updateStorageSongs(updated);
    } else {
      const updated = this.favorisAlbums$.value.filter((a) => a.id !== id);
      this.favorisAlbums$.next(updated);
      this.updateStorageAlbums(updated);
    }

    console.log(`✅ Favori ${type} supprimé :`, id);
  }

  // ==========================
  // 🔹 OBSERVABLES PUBLICS
  // ==========================
  get favoriteSongs$(): Observable<ISong[]> {
    return this.favorisSongs$.asObservable();
  }

  get favoriteAlbums$(): Observable<IAlbum[]> {
    return this.favorisAlbums$.asObservable();
  }

  // ==========================
  // 🔹 LOCAL STORAGE
  // ==========================
  private loadFromStorage() {
    const savedSongs = localStorage.getItem(this.storageKeySongs);
    const savedAlbums = localStorage.getItem(this.storageKeyAlbums);

    if (savedSongs) this.favorisSongs$.next(JSON.parse(savedSongs));
    if (savedAlbums) this.favorisAlbums$.next(JSON.parse(savedAlbums));

    console.log('[FavoritesService] Loaded from storage', {
      songs: this.favorisSongs$.value.length,
      albums: this.favorisAlbums$.value.length,
    });
  }

  private updateStorageSongs(list: ISong[]) {
    localStorage.setItem(this.storageKeySongs, JSON.stringify(list));
  }

  private updateStorageAlbums(list: IAlbum[]) {
    localStorage.setItem(this.storageKeyAlbums, JSON.stringify(list));
  }
}
