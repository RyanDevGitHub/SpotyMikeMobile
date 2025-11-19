import { inject, Injectable } from '@angular/core';
import { FirebaseError } from 'firebase/app';
import {
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';

import { LoginRequestError, LoginRequestSuccess } from '../interfaces/login';
import { IToken, IUserDataBase } from './../interfaces/user';
import { AuthService } from './auth.service';
import { Firebase } from './firebase.service';
import { UserRepositoryService } from './repositories/user-repository.service';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  private firestore = inject(Firebase);
  private auth = inject(AuthService);
  private userRepository = inject(UserRepositoryService);

  private token: IToken = { token: '' };

  constructor() {
    console.log('AUTHENTICATION SERVICE: Initialisé.');
  }

  login(
    email: string,
    password: string
  ): Observable<LoginRequestSuccess | LoginRequestError> {
    console.log(`LOGIN: Tentative de connexion pour l'email: ${email}`);
    return this.firestore.getDocumentByField('Users', 'email', email).pipe(
      switchMap((data) => {
        const user = data as IUserDataBase;
        // Utilisateur non trouvé
        if (!user) {
          console.warn(`LOGIN: Échec - Utilisateur non trouvé pour ${email}`);
          return of({ message: 'User not found' } as LoginRequestError);
        } // Mauvais mot de passe

        if (user.password !== password) {
          console.warn(`LOGIN: Échec - Mauvais mot de passe pour ${email}`);
          console.warn(user.password);
          console.warn(
            `LOGIN: Échec - Mot de passe fourni: ${password} mot de passe attendu: ${user.password}`
          );
          return of({ message: 'Invalid credentials' } as LoginRequestError);
        }

        console.log(
          'LOGIN: Utilisateur trouvé. Tentative de signIn Firebase...'
        ); // Login correct → convertir Promise signIn en Observable
        return from(this.auth.signIn(email, password)).pipe(
          switchMap((myToken) => {
            console.log(
              'LOGIN: signIn Firebase réussi. Tentative de vérifier le token...'
            );
            return from(this.auth.verifyToken(myToken)).pipe(
              map((myVerifyToken) => {
                if (myVerifyToken) this.token.token = myToken;
                console.log('LOGIN: Token vérifié. Connexion réussie.');

                return {
                  type: 'success',
                  error: false,
                  token: this.token,
                  user: user,
                } as LoginRequestSuccess;
              })
            );
          })
        );
      }),
      catchError((error) => {
        console.error(
          'LOGIN: ERREUR CRITIQUE DANS LE FLUX DE CONNEXION:',
          error
        ); // Timeout ou autre erreur réseau
        return throwError(() => new Error('NETWORK_ERROR'));
      })
    );
  }

  // signInWithGoogle(): Observable<LoginRequestSuccess | LoginRequestError> {
  //   console.log(
  //     'GOOGLE SIGN-IN: Début de l’appel à this.auth.signInWithGoogle()'
  //   );
  //   // 🚨 IL FAUT AJOUTER UN CATCH ICI POUR CAPTURER L'ERREUR DU PLUGIN CAPACITOR 🚨
  //   return this.auth.signInWithGoogle().pipe(
  //     map((result) => {
  //       console.log('GOOGLE SIGN-IN: Succès du processus Google.', result);
  //       return result; // Supposons que result est de type LoginRequestSuccess
  //     }),
  //     catchError((error) => {
  //       console.error(
  //         "*** GOOGLE SIGN-IN FAILED (TS) ***: Erreur capturée par l'AuthentificationService",
  //         error
  //       );
  //       // Si l'erreur est un objet, essayez d'accéder à son message :
  //       console.error('Erreur détaillée:', error.message || error);

  //       // Si le message d'erreur est trop long, le logcat peut le tronquer, d'où la nécessité de logs supplémentaires :
  //       if (
  //         error &&
  //         error.message &&
  //         error.message.includes('DEVELOPER_ERROR')
  //       ) {
  //         console.error(
  //           'ERREUR CLÉ: DEVELOPER_ERROR DETECTED! Vérifiez la configuration SHA-1 / Client ID.'
  //         );
  //       }

  //       // Retourner l'erreur pour la gestion front-end
  //       return of({
  //         message: error.message || 'Google Sign-In failed.',
  //       } as LoginRequestError);
  //     })
  //   );
  // }

  register(email: string, password: string, user: IUserDataBase) {
    console.log(`REGISTER: Tentative d'inscription pour l'email: ${email}`);
    this.auth
      .signUp(email, password)
      .then((userCredential) => {
        console.log('REGISTER: Inscription réussie', userCredential);
        user.id = userCredential;
        if (user.artiste?.firstName) user.artiste.id = userCredential;
        console.log(
          "REGISTER: Création de l'utilisateur dans la base de données..."
        );
        this.userRepository.createUser(user);
      })
      .catch((error: FirebaseError) => {
        console.error('REGISTER: Erreur Firebase capturée.');
        if (error.code === 'auth/email-already-in-use') {
          console.error(
            "REGISTER: L'adresse email est déjà utilisée par un autre compte."
          );
        } else {
          console.error(
            "REGISTER: Erreur d'inscription détaillée:",
            error.message
          );
        }
      });
  }
  logout(): Promise<void> {
    console.log('LOGOUT: Déconnexion en cours...');
    return this.auth.signOut(); // Firebase Auth fournit signOut()
  }
}
