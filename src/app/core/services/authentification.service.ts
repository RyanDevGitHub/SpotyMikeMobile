import { AuthService } from './auth.service';
import { IToken, IUserDataBase } from './../interfaces/user';
import { Firebase } from './firebase.service';
import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequestError, LoginRequestSuccess } from '../interfaces/login';
import { FirebaseError } from 'firebase/app';
import { UserRepositoryService } from './repositories/user-repository.service';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  private firestore = inject(Firebase);
  private auth = inject(AuthService);
  private userRepository = inject(UserRepositoryService);

  private token: IToken = { token: '' };

  constructor() {}

  login(
    email: string,
    password: string
  ): Observable<LoginRequestSuccess | LoginRequestError> {
    return this.firestore.getDocumentByField('Users', 'email', email).pipe(
      switchMap((user) => {
        // Utilisateur non trouvé
        if (!user)
          return of({ message: 'User not found' } as LoginRequestError);

        // Mauvais mot de passe
        if (user.password !== password)
          return of({ message: 'Invalid credentials' } as LoginRequestError);

        // Login correct → convertir Promise signIn en Observable
        return from(this.auth.signIn(email, password)).pipe(
          switchMap((myToken) =>
            from(this.auth.verifyToken(myToken)).pipe(
              map((myVerifyToken) => {
                if (myVerifyToken) this.token.token = myToken;

                return {
                  type: 'success',
                  error: false,
                  token: this.token,
                  user: user,
                } as LoginRequestSuccess;
              })
            )
          )
        );
      }),
      catchError((error) => {
        console.error('Error during login:', error);
        // Timeout ou autre erreur réseau
        return throwError(() => new Error('NETWORK_ERROR'));
      })
    );
  }

  register(email: string, password: string, user: IUserDataBase) {
    this.auth
      .signUp(email, password)
      .then((userCredential) => {
        console.log('Inscription réussie', userCredential);
        user.id = userCredential;
        if (user.artiste?.firstName) user.artiste.id = userCredential;
        this.userRepository.createUser(user);
      })
      .catch((error: FirebaseError) => {
        if (error.code === 'auth/email-already-in-use') {
          console.error(
            "L'adresse email est déjà utilisée par un autre compte."
          );
        } else {
          console.error("Erreur d'inscription:", error.message);
        }
      });
  }
  logout(): Promise<void> {
    return this.auth.signOut(); // Firebase Auth fournit signOut()
  }
}
