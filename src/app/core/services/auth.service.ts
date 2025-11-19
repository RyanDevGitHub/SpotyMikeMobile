import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core'; // Retrait de Inject et InjectionToken
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
// Import du jeton d'injection depuis le fichier dédié
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { from, Observable, of } from 'rxjs';

import { IUserDataBase } from '../interfaces/user';
import { EAuthPage } from '../models/refData';
import { FirebaseAuthToken } from './firebase-auth.token';
import { UserRepositoryService } from './repositories/user-repository.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private serverUrl = 'http://localhost:3000';
  WEB_CLIENT_ID =
    '823395277840-be9l5id933b1rk6e12dnoj9p9n92v2n4.apps.googleusercontent.com'; // Injection via le jeton explicite qui est configuré dans main.ts
  private auth: Auth = inject(FirebaseAuthToken);
  public user$: Observable<User | null>;
  public authState$ = new Observable<User | null>((subscriber) => {
    onAuthStateChanged(this.auth, subscriber);
  });
  constructor(
    private http: HttpClient,
    private userService: UserRepositoryService
  ) {
    this.user$ = new Observable<User | null>((subscriber) => {
      // Firebase lit la session du Local Storage et vérifie si le token est valide.
      // S'il est expiré, il utilise le Refresh Token (invisible) pour en obtenir un nouveau.
      onAuthStateChanged(this.auth, (user) => {
        subscriber.next(user);
      });
    });
  }

  getToken(forceRefresh: boolean = false): Observable<string | null> {
    const auth = getAuth(); // Obtenez l'instance Auth
    const user = auth.currentUser;

    if (!user) {
      // Retourne un Observable de null si l'utilisateur n'est pas connecté
      return of(null);
    }

    // Convertit la Promise de getIdToken en Observable
    return from(user.getIdToken(forceRefresh));
  }
  getPageAuth() {
    return of(EAuthPage.Login);
  }

  getUserData(uid: string): Observable<IUserDataBase> {
    console.log('[Auth] Fetching Firestore user document for uid:', uid);

    const userDocRef = doc(getFirestore(), 'Users', uid);

    const docPromise = getDoc(userDocRef).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        console.log('[Auth] Firestore document found:', docSnapshot.data());
        return docSnapshot.data() as IUserDataBase;
      }
      throw new Error('User document not found in Firestore.');
    });

    return from(docPromise);
  }

  // Créez une nouvelle méthode pour encapsuler l'abonnement
  // private checkRedirectStatus(): void {
  //   this.handleRedirectResult().subscribe({
  //     next: (result) => {
  //       if (result && result.type === 'success') {
  //         console.log(
  //           '--- AUTO-GESTION : Connexion par redirection réussie et finalisée ---'
  //         );
  //         // ICI, vous devez router l'utilisateur hors de la page de login
  //         // Si vous injectez le Router dans le AuthService, faites-le ici :
  //         // this.router.navigate(['/home']);
  //       }
  //     },
  //     error: (err) => {
  //       console.error(
  //         '--- AUTO-GESTION : Échec de la vérification de redirection ---',
  //         err
  //       );
  //     },
  //   });
  // }

  async signIn(email: string, password: string): Promise<string> {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    return userCredential.user?.getIdToken() ?? '';
  }

  signInWithStoredToken(jwtToken: string): Observable<User> {
    console.log('[Auth] Signing in with stored token:', jwtToken);

    const signInPromise = signInWithCustomToken(this.auth, jwtToken).then(
      (userCredential) => {
        console.log(
          '[Auth] Firebase signIn success, user:',
          userCredential.user
        );
        return userCredential.user;
      }
    );

    return from(signInPromise);
  }

  // signInWithGoogle(
  //   useRedirect?: boolean
  // ): Observable<LoginRequestSuccess | LoginRequestError> {
  //   console.log('--- Service : Entrée dans signInWithGoogle ---');

  //   // L'opérateur 'from' doit recevoir la Promise RÉSULTANTE
  //   return from(
  //     (async () => {
  //       // 1. Définition de la fonction async

  //       // ✅ Le code va s'exécuter et le log devrait s'afficher
  //       const isNative =
  //         (window as any)?.Capacitor?.isNativePlatform?.() ?? false;
  //       console.log('isNative platform:', isNative);

  //       if (isNative) {
  //         try {
  //           const res = await SocialLogin.login({
  //             provider: 'google',
  //             options: {
  //               scopes: ['email', 'profile'],
  //             },
  //           });
  //           const googleUser = res.result as { idToken: string };

  //           if (!googleUser.idToken) {
  //             throw new Error('Google ID Token missing from native response.');
  //           }

  //           const credential = GoogleAuthProvider.credential(
  //             googleUser.idToken
  //           );

  //           return await signInWithCredential(this.auth, credential);
  //         } catch (err: any) {
  //           throw new Error(
  //             `Native Google login failed: ${err.message || 'Unknown error'}`
  //           );
  //         }
  //       } else {
  //         const provider = new GoogleAuthProvider();
  //         const auth = getAuth();
  //         try {
  //           // Await and return the UserCredential so every code path returns a value
  //           const result = await signInWithPopup(auth, provider);
  //           return result;
  //         } catch (error: any) {
  //           // Normalize the error by throwing so the outer from(...) promise rejects and is handled by catchError
  //           throw new Error(
  //             `Web Google login failed: ${error?.message || 'Unknown error'}`
  //           );
  //         }
  //       }
  //       // Note: Il est crucial que tous les chemins de code retournent ou lèvent une erreur.
  //     })() // 2. L'appel immédiat : retourne la Promise au 'from'
  //   ).pipe(
  //     switchMap((userCredential) => this.handleCredential(userCredential ?? null)),
  //     catchError((err: any) => {
  //       console.error(err);
  //       return of({
  //         type: 'error',
  //         message: err.message || 'Google login failed',
  //       } as LoginRequestError);
  //     })
  //   );
  // }

  // handleRedirectResult(): Observable<LoginRequestSuccess | LoginRequestError> {
  //   const auth = getAuth();

  //   return from(getRedirectResult(auth)).pipe(
  //     // --- ÉTAPE 1 : Récupération du résultat de la redirection ---
  //     switchMap((userCredential: UserCredential | null) => {
  //       // ⭐ LOG 1 : Indique si un résultat a été trouvé
  //       console.log(
  //         'REDIRECTION CHECK: Résultat de getRedirectResult:',
  //         !!userCredential
  //       );

  //       if (userCredential) {
  //         console.log(
  //           'SUCCESS: Redirection Firebase détectée. Tentative de gestion des identifiants.'
  //         );

  //         // ⭐ LOG 2 : Affiche le token ID (ou une partie)
  //         const idToken = (userCredential.user as any)?.accessToken || 'N/A';
  //         console.log(
  //           'REDIRECTION TOKEN ID (partial):',
  //           idToken.substring(0, 10) + '...'
  //         );

  //         return this.handleCredential(userCredential);
  //       }

  //       // ⭐ LOG 3 : Si pas de résultat de redirection, on passe
  //       console.log('REDIRECTION CHECK: Aucune donnée de redirection trouvée.');
  //       return EMPTY;
  //     })
  //     // ... (catchError reste inchangé)
  //   );
  // }

  // private handleCredential(
  //   userCredential: UserCredential | null
  // ): Observable<LoginRequestSuccess | LoginRequestError> {
  //   const firebaseUser = userCredential?.user ?? null;
  //   if (!firebaseUser) {
  //     return of({
  //       type: 'error',
  //       message: 'Google login failed',
  //     } as LoginRequestError);
  //   }

  //   return from(firebaseUser.getIdToken()).pipe(
  //     switchMap((idToken) => {
  //       const tokenObj: IToken = { token: idToken };

  //       return this.userService.getOrCreateUser(firebaseUser).pipe(
  //         map(
  //           (user) =>
  //             ({
  //               type: 'success',
  //               user,
  //               token: tokenObj,
  //               error: false,
  //             } as LoginRequestSuccess)
  //         )
  //       );
  //     })
  //   );
  // }

  async signUp(email: string, password: string): Promise<string> {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    return userCredential.user?.getIdToken() ?? '';
  }

  async verifyToken(idToken: string): Promise<Observable<object>> {
    return await this.http.post(`http://localhost:3000/verify-token`, {
      idToken,
    });
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }
}
