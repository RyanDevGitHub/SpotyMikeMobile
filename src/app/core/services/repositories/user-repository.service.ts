import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LocalStorageService } from 'src/app/core/services/local-strorage.service';
import { inject, Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import {
  ERoleUser,
  IUser,
  IUserDataBase,
  IUserUpdateDataBase,
} from '../../interfaces/user';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { IPlaylist, IPlaylistRaw, ISongRef } from '../../interfaces/playlistes';

@Injectable({
  providedIn: 'root',
})
export class UserRepositoryService {
  app = initializeApp(environment.firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(this.app);

  private usersCollection = collection(this.db, environment.collection.users);
  localStorageService: LocalStorageService = inject(LocalStorageService);
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  getOrCreateUser(firebaseUser: any): Observable<IUser> {
    const userRef = this.firestore.collection('Users').doc(firebaseUser.uid);

    return userRef.get().pipe(
      switchMap((doc) => {
        if (doc.exists) {
          const user = doc.data() as IUserDataBase;
          return of(user);
        } else {
          const displayName = firebaseUser.displayName ?? '';
          const nameParts = displayName.split(' ');

          // Ici on récupère l'avatar par défaut en Observable
          const defaultAvatar$ = from(
            this.storage.ref('avatar/user.png').getDownloadURL().toPromise()
          );

          return defaultAvatar$.pipe(
            switchMap((defaultAvatarUrl) => {
              const user: IUserDataBase = {
                id: firebaseUser.uid,
                avatar: defaultAvatarUrl, // ← avatar par défaut
                firstName: nameParts[0] ?? '',
                lastName: nameParts.slice(1).join(' ') ?? '',
                password: '',
                email: firebaseUser.email ?? '',
                tel: '',
                sexe: 'non-defini',
                favorites: { songs: [], albums: [] },
                playlists: [],
                lastsplayeds: [],
                created_at: new Date().toISOString(),
                role: ERoleUser.User,
              };

              // Enregistrer dans Firestore
              userRef.set(user);

              // Stockage local
              this.localStorageService.setItem('token', {
                token: firebaseUser.stsTokenManager?.accessToken ?? '',
              });
              this.localStorageService.setItem('idUser', user.id);

              return of(user);
            })
          );
        }
      })
    );
  }

  async createUser(user: IUserDataBase) {
    // Construire l'objet utilisateur
    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      email: user.email,
      tel: user.tel || null,
      sexe: user.sexe,
      role: user.role,
      favorites: user.favorites || [],
      lastsplayeds: user.lastsplayeds || [],
      created_at: user.created_at,
    };

    // Ajouter l'utilisateur à la collection "Users"
    const userRef = await addDoc(
      collection(this.db, environment.collection.users),
      userData
    );

    // Ajouter les informations de l'artiste si disponibles
    if (user.artiste && user.artiste.id) {
      // Assurez-vous que `user.artiste.id` n'est pas vide
      const artistRef = doc(collection(userRef, 'artist'), user.artiste.id);
      await setDoc(artistRef, user.artiste); // Assurez-vous que `user.artiste` correspond à `IArtist`
    }

    // Ajouter les playlists dans une sous-collection "playlists"
    if (user.playlists && user.playlists.length > 0) {
      const playlistsRef = collection(userRef, 'playlists');
      for (const playlist of user.playlists) {
        await addDoc(playlistsRef, playlist);
      }
    }

    console.log('Success : User Created with Playlists and Artist Info');
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
    value: any
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
  async getUsersByField(fieldName: string, value: string): Promise<any | null> {
    const querySnapshotPromise = await getDocs(
      query(
        collection(this.db, environment.collection.users),
        where(fieldName, '==', value)
      )
    );
    if (!querySnapshotPromise.empty) {
      return querySnapshotPromise.docs[0].data();
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
    await this.updateUser(userId, { lastsplayeds: arrayUnion(songId) });

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
    song: ISongRef
  ): Promise<IPlaylistRaw> {
    console.log('🏗️ Repository createPlaylist appelé avec:', {
      userId,
      title,
      song,
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

    const playlist: IPlaylistRaw = {
      id: crypto.randomUUID(),
      title,
      songs: [song],
      cover: '',
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
