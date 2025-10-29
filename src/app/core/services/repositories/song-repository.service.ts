import { UserRepositoryService } from './user-repository.service';
import { loadSongsFromAlbums } from '../../store/action/song.action';
import { inject, Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
} from 'firebase/firestore';

import { environment } from 'src/environments/environment';
import { ISong } from '../../interfaces/song';
import { IAlbum } from '../../interfaces/album';
import { v4 as uuidv4 } from 'uuid';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';

@Injectable({
  providedIn: 'root',
})
export class SongRepositoryService {
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);
  store = inject(Store<AppState>);
  userRepositoryService = inject(UserRepositoryService);
  private lastIncrementMap: Record<string, number> = {}; // Anti-spam par chanson

  constructor() {}

  // Récupérer toutes les chansons
  async getAllSongsWithArtist(): Promise<ISong[]> {
    const querySnapshot = await getDocs(collection(this.db, 'Albums'));

    // Extraire et aplatir les chansons
    const songs: ISong[] = querySnapshot.docs
      .map((doc) => doc.data())
      .filter((doc) => doc['songs'])
      .flatMap((doc) => {
        const songList = doc['songs'];
        return Array.isArray(songList)
          ? songList.map((song, index) => ({
              ...song,
              id: song['id'] || `${doc['id']}_${index}`, // ID unique
              albumId: doc['id'],
              createAt: song.createAt?.seconds
                ? new Date(song.createAt.seconds * 1000)
                : song.createAt || new Date(),
            }))
          : [];
      });

    // Ajouter artistInfo
    const songsWithArtistInfo = await Promise.all(
      songs.map(async (song) => {
        const artistInfo = await this.userRepositoryService.getUsersByField(
          'id',
          song.artistId,
        );
        return { ...song, artistInfo };
      }),
    );

    return songsWithArtistInfo;
  }

  // Récupérer une chanson par ID
  async getSongById(songId: string): Promise<ISong | null> {
    const albumsCollection = collection(this.db, 'Albums');
    const querySnapshot = await getDocs(albumsCollection);

    for (const docSnap of querySnapshot.docs) {
      const albumData = docSnap.data();
      if (albumData['songs'] && Array.isArray(albumData['songs'])) {
        const song = albumData['songs'].find(
          (song: ISong) => song.id === songId,
        );
        if (song) {
          return {
            ...song,
            albumId: docSnap.id,
            createAt: song.createAt?.seconds
              ? new Date(song.createAt.seconds * 1000)
              : song.createAt || new Date(),
          };
        }
      }
    }

    return null;
  }

  // Ajouter une nouvelle chanson
  async addSong(song: ISong, albumId?: string): Promise<void> {
    const songWithId: ISong = {
      ...song,
      id: song.id || uuidv4(),
      createAt: song.createAt || new Date(), // Assure un Date JS
    };

    if (albumId) {
      const albumDocRef = doc(this.db, 'Albums', albumId);
      const albumSnap = await getDoc(albumDocRef);

      if (albumSnap.exists()) {
        const albumData = albumSnap.data();
        const updatedSongs = albumData['songs']
          ? [...albumData['songs'], songWithId]
          : [songWithId];

        await updateDoc(albumDocRef, { songs: updatedSongs });
        console.log('Success: Song added to existing album');
        this.store.dispatch(loadSongsFromAlbums());
      } else {
        console.error('Error: Album not found');
      }
    } else {
      const newAlbum = { songs: [songWithId] };
      await addDoc(collection(this.db, 'Albums'), newAlbum);
      console.log('Success: New album created with the song');
      this.store.dispatch(loadSongsFromAlbums());
    }
  }

  /**
   * Incrémente le compteur d'écoutes d'une chanson dans Firestore
   * @param song ISong contenant id et albumId
   * @param minIntervalMs Intervalle minimal entre deux incréments pour un même utilisateur (default 10s)
   */
  async incrementSongListeningCount(
    song: ISong,
    minIntervalMs: number = 10000,
  ): Promise<void> {
    const songId = song.id;
    const albumId = song.albumInfo?.id;

    if (!albumId || !songId) {
      console.warn('⚠️ albumId ou songId manquant');
      return;
    }

    const now = Date.now();
    const lastIncrement = this.lastIncrementMap[songId] || 0;
    if (now - lastIncrement < minIntervalMs) {
      console.log(
        `⏱️ Anti-spam: pas d'incrément pour ${songId} pour le moment`,
      );
      return;
    }

    try {
      // Récupérer l'album
      const albumRef = doc(this.db, 'Albums', albumId);
      const albumSnap = await getDoc(albumRef);
      if (!albumSnap.exists()) {
        console.warn(`⚠️ Album ${albumId} introuvable`);
        return;
      }

      const albumData = albumSnap.data();
      const songs = albumData['songs'] || [];
      const songIndex = songs.findIndex((s: any) => s.id === songId);
      if (songIndex === -1) {
        console.warn(`⚠️ Chanson ${songId} introuvable dans l'album`);
        return;
      }

      // Incrémenter listeningCount (conversion string → number)
      const currentCount = Number(songs[songIndex].listeningCount || 0);
      songs[songIndex] = {
        ...songs[songIndex],
        listeningCount: (currentCount + 1).toString(),
      };

      // Enregistrer les changements dans Firestore
      await updateDoc(albumRef, { songs });

      // Mettre à jour la dernière incrémentation pour l’anti-spam
      this.lastIncrementMap[songId] = now;

      console.log(
        `🎧 +1 écoute pour "${songs[songIndex].title}" (${currentCount} → ${
          currentCount + 1
        })`,
      );
    } catch (error) {
      console.error("❌ Erreur lors de l'incrémentation du compteur :", error);
    }
  }
}
