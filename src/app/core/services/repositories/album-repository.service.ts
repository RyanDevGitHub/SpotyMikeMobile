import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  getFirestore,
} from 'firebase/firestore';

import { environment } from 'src/environments/environment';
import { IAlbum } from '../../interfaces/album';
import { ISong } from '../../interfaces/song';

@Injectable({ providedIn: 'root' })
export class AlbumsRepository {
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);
  private albumsCollection = collection(this.db, environment.collection.albums);
  constructor() {}

  // Récupérer tous les albums
  async getAllAlbums(): Promise<IAlbum[]> {
    const querySnapshot = await getDocs(this.albumsCollection);
    return querySnapshot.docs.map((docSnap) => {
      return { id: docSnap.id, ...docSnap.data() } as IAlbum;
    });
  }

  // Récupérer un album par son ID
  async getAlbumById(albumId: string): Promise<IAlbum | null> {
    const albumDocRef = doc(this.db, environment.collection.albums, albumId);
    const docSnap = await getDoc(albumDocRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as IAlbum;
    }
    return null;
  }

  // Récupérer toutes les chansons d'un album
  async getSongsByAlbumId(albumId: string): Promise<ISong[]> {
    const album = await this.getAlbumById(albumId);
    if (!album) return [];
    return album.songs || [];
  }

  // Récupérer toutes les chansons de tous les albums
  async getAllSongs(): Promise<ISong[]> {
    const albums = await this.getAllAlbums();
    return albums.flatMap((album) => album.songs || []);
  }
}
