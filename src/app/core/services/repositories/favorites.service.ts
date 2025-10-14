import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { filter, firstValueFrom, from, map, switchMap, take } from 'rxjs';
import { UserRepositoryService } from './user-repository.service';
import { ISong } from '../../interfaces/song';
import { AlbumsRepository } from './album-repository.service';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { selectAllSongs } from '../../store/selector/song.selector';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private usersRepository = inject(UserRepositoryService);
  private albumsRepository = inject(AlbumsRepository);
  private store = inject(Store<AppState>);

  constructor(private firestore: AngularFirestore) {}

  async addFavorite(userId: string, songId: string) {
    const user = await this.usersRepository.getUserById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const favorites = user.favorites || [];

    if (!favorites.includes(songId)) {
      favorites.push(songId);
    }

    console.log('✅ Favori ajouté :', songId);

    await this.usersRepository.updateUser(userId, {
      favorites: favorites, // <- envoyer directement le tableau
    });

    console.log('✅ Favori ajouté et user mis à jour');
  }

  // Supprimer un favori
  async removeFavorite(userId: string, songId: string) {
    const user = await this.usersRepository.getUserById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    let favorites = user.favorites || [];
    favorites = favorites.filter((fav) => fav !== songId);

    await this.usersRepository.updateUser(userId, {
      favorites: favorites, // <- envoyer directement le tableau
    });

    console.log('✅ Favori supprimé et user mis à jour');
  }
  // Récupérer les favoris complets (avec les infos des songs)
  async getUserFavorites(userId: string | undefined): Promise<ISong[]> {
    const user = await this.usersRepository.getUserById(userId);
    if (!user) return [];

    const favoriteIds = user.favorites || [];

    // Récupérer toutes les chansons directement, sans filter bloquant
    const allSongs = await firstValueFrom(
      this.store.select(selectAllSongs).pipe(take(1))
    );

    console.log(
      '🎵 Toutes les chansons récupérées (artistInfo peut être null) :',
      allSongs
    );

    // Filtrer uniquement les favoris
    const favorites = allSongs.filter((song) => favoriteIds.includes(song.id));

    console.log('🎵 Favorites filtrés :', favorites);

    return favorites;
  }
}
