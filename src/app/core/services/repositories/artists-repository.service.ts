import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';

import { IArtist } from '../../interfaces/user';

@Injectable({ providedIn: 'root' })
export class ArtistsRepository {
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);
  private usersCollection = collection(this.db, environment.collection.users);

  constructor() {}

  // Récupérer tous les artistes
  async getAllArtists(): Promise<IArtist[]> {
    try {
      const q = query(this.usersCollection, where('role', '==', 'Artist'));
      const querySnapshot = await getDocs(q);

      // ⚡ On fait toutes les sous-queries en parallèle
      const artistDocsPromises = querySnapshot.docs.map(async (userDoc) => {
        const userId = userDoc.id;
        const artistColRef = collection(this.db, 'Users', userId, 'artiste');
        const artistColSnap = await getDocs(artistColRef);

        // Si la sous-collection existe et contient au moins un doc
        if (!artistColSnap.empty) {
          const artistData = artistColSnap.docs[0].data() as IArtist;

          return {
            id: artistColSnap.docs[0].id,
            userId,
            firstName: artistData.firstName,
            label: artistData.label,
            description: artistData.description,
            avatar: artistData.avatar,
            subscribers: artistData.subscribers ?? [],
          } as IArtist;
        }

        return null; // pas d'info artiste
      });

      const artists = (await Promise.all(artistDocsPromises)).filter(
        (a): a is IArtist => a !== null,
      );

      console.log('[Repository] ✅ Loaded artists:', artists.length);
      return artists;
    } catch (error) {
      console.error('[Repository] ❌ Error loading artists:', error);
      return [];
    }
  }

  // Récupérer un artiste par son ID
  async getArtistById(artistId: string): Promise<IArtist | null> {
    const artistDocRef = doc(this.db, environment.collection.users, artistId);
    const docSnap = await getDoc(artistDocRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as IArtist;
    }
    return null;
  }
}
