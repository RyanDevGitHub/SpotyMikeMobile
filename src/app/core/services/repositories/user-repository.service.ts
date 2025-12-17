import { inject, Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';
import {
  // Type pour l'injection
  Storage,
} from '@angular/fire/storage';
// IMPORTS FIREBASE V9
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  FieldValue,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, StorageReference } from 'firebase/storage'; // Nouveau pour Storage
import { from, map, Observable, of, switchMap } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { environment } from 'src/environments/environment';

// RETIRER : AngularFirestore, AngularFireStorage, DocumentData (redondant)
import {
  IInitialSongRef,
  IPlaylistRaw,
  ISongRef,
} from '../../interfaces/playlists';
import {
  ERoleUser,
  IFirebaseUser,
  IUser,
  IUserDataBase,
  IUserUpdateDataBase,
} from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserRepositoryService {
  // Injection des services de base au lieu de les initialiser ici
  // L'initialisation se fait une seule fois dans main.ts
  db: Firestore = inject(Firestore); // Injecte le service Firestore V9
  storage: Storage = inject(Storage); // Injecte le service Storage V9

  // Utilisation de l'app de base pour d'autres usages si nécessaire
  // Note: Firestore et Storage sont déjà liés à l'app via provide...
  app: FirebaseApp = inject(FirebaseApp);

  private usersCollection = collection(this.db, environment.collection.users);
  localStorageService: LocalStorageService = inject(LocalStorageService);
  // CORRECTION : Le constructeur est vide car nous utilisons `inject`
  constructor() {}
  // Ancienne injection supprimée : private firestore: AngularFirestore, private storage: AngularFireStorage

  // ... (le reste de la classe suit)
  // Méthode entièrement réécrite en Promesses/Observables V9

  getOrCreateUser(firebaseUser: IFirebaseUser): Observable<IUser> {
    // 1. Référence au document Firestore
    const userRef = doc(this.db, 'Users', firebaseUser.uid);

    // 2. Tente de récupérer l'utilisateur (Firestore V9 - getDoc)
    return from(getDoc(userRef)).pipe(
      switchMap((docSnap) => {
        if (docSnap.exists()) {
          // Utilisateur trouvé
          const user = docSnap.data() as IUserDataBase;
          return of(user);
        } else {
          // Utilisateur non trouvé, créer l'utilisateur
          const displayName = firebaseUser.displayName ?? '';
          const nameParts = displayName.split(' ');

          // 3. Récupère l'URL de l'avatar par défaut (Storage V9)
          const storageRef: StorageReference = ref(
            this.storage,
            'avatar/user.png'
          );

          // from(getDownloadURL(...)) transforme la promesse en Observable
          const defaultAvatar$ = from(getDownloadURL(storageRef));

          return defaultAvatar$.pipe(
            switchMap((defaultAvatarUrl) => {
              const user: IUserDataBase = {
                id: firebaseUser.uid,
                avatar: defaultAvatarUrl,
                firstName: nameParts[0] ?? '',
                lastName: nameParts.slice(1).join(' ') ?? '',
                password: '',
                email: firebaseUser.email ?? '',
                tel: '',
                sexe: 'non-défini',
                favorites: { songs: [], albums: [] },
                playlists: [],
                lastsPlayed: [],
                created_at: new Date().toISOString(),
                role: ERoleUser.User,
              };

              // 4. Enregistrer dans Firestore (V9 - setDoc)
              // from(setDoc(...)) transforme la promesse en Observable (pour chaîner le switchMap)
              return from(setDoc(userRef, user)).pipe(
                map(() => {
                  // Stockage local
                  console.log(
                    'UserRepository: Nouvel utilisateur créé dans Firestore',
                    firebaseUser.stsTokenManager?.accessToken
                  );
                  this.localStorageService.setItem('token', {
                    token: firebaseUser.stsTokenManager?.accessToken ?? '',
                  });
                  this.localStorageService.setItem('idUser', {
                    idUser: user.id,
                  });
                  return user;
                })
              );
            })
          );
        }
      })
    );
  }

  async createUser(user: IUserDataBase) {
    // 0. VÉRIFICATION CRITIQUE : Assurez-vous que user.id contient l'UID Firebase.
    if (!user.id) {
      console.error(
        "Erreur: L'ID de l'utilisateur (UID) est manquant. Impossible de nommer le document."
      );
      return;
    }

    // Le document Firestore portera l'ID user.id (l'UID)
    const documentId = user.id;

    // 1. Construire l'objet utilisateur (simplifié pour la lisibilité, vous pouvez garder votre structure)
    const userData = {
      // ... vos champs existants
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      email: user.email,
      tel: user.tel || null,
      sexe: user.sexe,
      role: user.role,
      favorites: user.favorites || [],
      lastsPlayed: user.lastsPlayed || [],
      created_at: user.created_at,
    };

    // 2. CRÉATION DE LA RÉFÉRENCE EXPLICITE AU DOCUMENT
    // Utiliser doc() pour pointer vers un document avec l'ID spécifié (documentId)
    const userRef = doc(this.db, environment.collection.users, documentId);

    // 3. ÉCRIRE LE DOCUMENT UTILISATEUR PRINCIPAL AVEC setDoc()
    // setDoc écrase ou crée le document à l'emplacement userRef (qui a l'ID = UID)
    await setDoc(userRef, userData);

    // ----------------------------------------------------
    // Les sous-collections (elles utilisent déjà la référence userRef)
    // ----------------------------------------------------

    // 4. Ajouter les informations de l'artiste si disponibles
    if (user.artiste && user.artiste.id) {
      // Si vous utilisez user.artiste.id comme l'UID, vous devriez utiliser setDoc ici aussi
      // pour que l'ID du document artiste soit aussi l'UID.
      const artistRef = doc(collection(userRef, 'artist'), user.artiste.id);
      await setDoc(artistRef, user.artiste);
    }

    // 5. Ajouter les playlists dans une sous-collection "playlists"
    if (user.playlists && user.playlists.length > 0) {
      const playlistsRef = collection(userRef, 'playlists');
      for (const playlist of user.playlists) {
        // Pour les items dans une sous-collection (playlists), il est généralement préférable
        // d'utiliser addDoc pour laisser Firestore générer un ID unique pour la playlist.
        await addDoc(playlistsRef, playlist);
      }
    }

    console.log('Success : User Created. Document ID = UID');
  }

  async getUserById(fieldId: string | undefined): Promise<IUserDataBase> {
    const usersCollection = collection(this.db, 'Users'); // Référence à la collection
    const q = query(usersCollection, where('id', '==', fieldId)); // Requête sur le champ `id`

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0]; // Supposons qu'un seul utilisateur correspond
      return docSnap.data() as IUserDataBase;
    } else {
      // console.warn('[DEBUG] No user found with field ID:', fieldId);
      return {} as IUserDataBase;
    }
  }

  async setUserField(
    UserId: string | undefined,
    fieldName: string,
    value: object | string | number | boolean | FieldValue
  ): Promise<void> {
    const usersCollection = collection(this.db, 'Users');
    const q = query(usersCollection, where('id', '==', UserId));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        [fieldName]: value, // clé dynamique
      });
      // console.log(`[DEBUG] Champ "${fieldName}" mis à jour avec :`, value);
    } else {
      // console.warn('[DEBUG] Aucun utilisateur trouvé avec field ID:', UserId);
    }
  }
  async getUsersByField<T extends DocumentData>( // T est le type attendu
    fieldName: string,
    value: string
    // ✅ Le type de retour est Promise<T | null>
  ): Promise<T | null> {
    const querySnapshotPromise = await getDocs(
      query(
        collection(this.db, environment.collection.users),
        where(fieldName, '==', value)
      )
    );

    if (!querySnapshotPromise.empty) {
      // 👈 Assertion interne : On assure à TypeScript que DocumentData est de type T
      return querySnapshotPromise.docs[0].data() as T;
    } else {
      return null;
    }
  }

  async addToLastPlayed(
    userId: string | undefined,
    songId: string
  ): Promise<IUserDataBase> {
    if (!userId) {
      throw new Error('User ID is undefined');
    }

    // Mettre à jour le champ favorites avec arrayUnion
    await this.updateUser(userId, { lastsPlayed: arrayUnion(songId) });

    // console.log(`[DEBUG] Song ajoutée aux lastplayeds : ${songId}`);

    // Récupérer le user mis à jour
    const usersCollection = collection(this.db, 'Users');
    const q = query(usersCollection, where('id', '==', userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      const updatedDoc = await getDoc(docRef);
      return updatedDoc.data() as IUserDataBase;
    } else {
      // console.warn('[DEBUG] Aucun utilisateur trouvé avec user ID:', userId);
      throw new Error('User not found after update');
    }
  }

  // get Users collection
  async getUsersCollection() {
    const querySnapshot = await getDocs(
      collection(this.db, environment.collection.users)
    );
    return querySnapshot.docs.map((doc) => doc.data());
  }

  // get sous collection
  async getSousCollection(
    collectionName: string,
    documentId: string,
    sousCollectionName: string
  ) {
    const querySnapshot = await getDocs(
      collection(this.db, collectionName, documentId, sousCollectionName)
    );
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async updateUser(
    userId: string,
    updates: Partial<IUserUpdateDataBase>
  ): Promise<void> {
    const q = query(
      collection(this.db, environment.collection.users).withConverter(
        this.userConverter
      ),
      where('id', '==', userId)
    );

    const querySnap = await getDocs(q);

    if (querySnap.empty) {
      throw new Error(`Utilisateur avec id=${userId} non trouvé`);
    }

    // Récupérer la référence du premier doc
    const docRef = querySnap.docs[0].ref;

    await updateDoc(docRef, updates);
    console.log('✅ Success : User Update');
  }

  async createPlaylist(
    userId: string,
    title: string,
    initialSong: IInitialSongRef
  ): Promise<IPlaylistRaw> {
    console.log('🏗️ Repository createPlaylist appelé avec:', {
      userId,
      title,
      initialSong,
    });
    const q = query(
      collection(this.db, environment.collection.users).withConverter(
        this.userConverter
      ),
      where('id', '==', userId)
    );

    const querySnap = await getDocs(q);
    console.log('📄 Query Firestore renvoie docs:', querySnap.docs.length);

    if (querySnap.empty) {
      console.error('❌ Utilisateur non trouvé');
      throw new Error(`Utilisateur avec id=${userId} non trouvé`);
    }

    const docRef = querySnap.docs[0].ref;

    const initialCoverUrl = initialSong.songCoverUrl || 'assets/shapes.svg'; // Fallback
    const playlist: IPlaylistRaw = {
      id: crypto.randomUUID(),
      title,
      songs: [{ idSong: initialSong.idSong }],
      cover: initialCoverUrl,
    };

    console.log('💾 Mise à jour Firestore avec playlist:', playlist);
    await updateDoc(docRef, {
      playlists: arrayUnion(playlist),
    });

    console.log('✅ Playlist ajoutée à Firestore');
    return playlist;
  }

  // 🔹 Delete un User via son champ userId
  async deleteUser(userId: string): Promise<void> {
    const q = query(
      collection(this.db, environment.collection.users),
      where('id', '==', userId)
    );

    const querySnap = await getDocs(q);

    if (querySnap.empty) {
      throw new Error(`Utilisateur avec id=${userId} non trouvé`);
    }

    const docRef = querySnap.docs[0].ref;
    await deleteDoc(docRef);
    console.log('✅ Success : User Delete');
  }

  async addSongToPlaylist(
    userId: string,
    playlistId: string,
    song: ISongRef
  ): Promise<IPlaylistRaw> {
    console.log(
      `[addSongToPlaylist] Called with userId=${userId}, playlistId=${playlistId}, song=`,
      song
    );

    const q = query(
      collection(this.db, environment.collection.users).withConverter(
        this.userConverter
      ),
      where('id', '==', userId)
    );

    const querySnap = await getDocs(q);

    if (querySnap.empty) {
      console.error(
        `[addSongToPlaylist] Utilisateur avec id=${userId} non trouvé`
      );
      throw new Error(`Utilisateur avec id=${userId} non trouvé`);
    }

    const docRef = querySnap.docs[0].ref;
    const userData = querySnap.docs[0].data();

    // On récupère la playlist ciblée
    const playlists: IPlaylistRaw[] = userData.playlists || [];
    console.log(`[addSongToPlaylist] User playlists:`, playlists);

    const playlistIndex = playlists.findIndex((p) => p.id === playlistId);

    if (playlistIndex === -1) {
      console.error(
        `[addSongToPlaylist] Playlist avec id=${playlistId} non trouvée`
      );
      throw new Error(`Playlist avec id=${playlistId} non trouvée`);
    }

    // On ajoute la chanson
    const updatedPlaylist: IPlaylistRaw = {
      ...playlists[playlistIndex],
      songs: [...(playlists[playlistIndex].songs || []), song],
    };
    console.log(`[addSongToPlaylist] Updated playlist:`, updatedPlaylist);

    // On reconstruit toutes les playlists avec la modif
    const updatedPlaylists = [...playlists];
    updatedPlaylists[playlistIndex] = updatedPlaylist;

    // On sauvegarde dans Firestore
    await updateDoc(docRef, {
      playlists: updatedPlaylists,
    });

    console.log(`✅ [addSongToPlaylist] Song added to playlist ${playlistId}`);
    return updatedPlaylist;
  }

  async removeSongFromPlaylist(
    userId: string,
    playlistId: string,
    songId: string
  ): Promise<IPlaylistRaw> {
    console.log(
      `[removeSongFromPlaylist] Called with userId=${userId}, playlistId=${playlistId}, songId=${songId}`
    );

    const q = query(
      collection(this.db, environment.collection.users).withConverter(
        this.userConverter
      ),
      where('id', '==', userId)
    );

    const querySnap = await getDocs(q);

    if (querySnap.empty) {
      throw new Error(`Utilisateur avec id=${userId} non trouvé`);
    }

    const docRef = querySnap.docs[0].ref;
    const userData = querySnap.docs[0].data();

    const playlists: IPlaylistRaw[] = userData.playlists || [];
    const playlistIndex = playlists.findIndex((p) => p.id === playlistId);

    if (playlistIndex === -1) {
      throw new Error(`Playlist avec id=${playlistId} non trouvée`);
    }

    const playlist = playlists[playlistIndex];
    const updatedSongs = (playlist.songs || []).filter(
      (s) => s.idSong !== songId
    );

    const updatedPlaylist: IPlaylistRaw = {
      ...playlist,
      songs: updatedSongs,
    };

    const updatedPlaylists = [...playlists];
    updatedPlaylists[playlistIndex] = updatedPlaylist;

    await updateDoc(docRef, { playlists: updatedPlaylists });

    console.log(
      `🗑️ [removeSongFromPlaylist] Song ${songId} removed from playlist ${playlistId}`
    );
    return updatedPlaylist;
  }

  // 🔹 Delete un User par un autre champ (ex: email, tel, etc.)
  async deleteUserByField(fieldName: string, value: string): Promise<void> {
    const q = query(
      collection(this.db, environment.collection.users),
      where(fieldName, '==', value)
    );

    const querySnap = await getDocs(q);

    if (querySnap.empty) {
      console.log(`❌ Aucun utilisateur trouvé avec ${fieldName}=${value}`);
      return;
    }

    for (const docSnap of querySnap.docs) {
      await deleteDoc(docSnap.ref);
    }

    console.log(
      `✅ Success: User(s) with ${fieldName}=${value} deleted from ${environment.collection.users} collection.`
    );
  }

  userConverter: FirestoreDataConverter<IUserUpdateDataBase> = {
    toFirestore(user: IUserUpdateDataBase): DocumentData {
      return user;
    },
    fromFirestore(snapshot, options): IUserUpdateDataBase {
      return snapshot.data(options) as IUserUpdateDataBase;
    },
  };
}
