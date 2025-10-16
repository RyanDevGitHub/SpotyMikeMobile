import { Injectable } from '@angular/core';
import { EAuthPage } from '../models/refData';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of, switchMap } from 'rxjs';
import { LoginRequestError, LoginRequestSuccess } from '../interfaces/login';
import { UserRepositoryService } from './repositories/user-repository.service';
import { GoogleAuthProvider, UserCredential } from 'firebase/auth';
import { IToken } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private serverUrl = 'http://localhost:3000'; // URL de ton serveur Node.js

  constructor(
    private afAuth: AngularFireAuth,
    private http: HttpClient,
    private userService: UserRepositoryService
  ) {}
  getPageAuth() {
    return of(EAuthPage.Login);
  }

  async signIn(email: string, password: string): Promise<string> {
    const userCredential = await this.afAuth.signInWithEmailAndPassword(
      email,
      password
    );
    return userCredential.user?.getIdToken() ?? '';
  }
  signInWithGoogle(): Observable<LoginRequestSuccess | LoginRequestError> {
    const provider = new GoogleAuthProvider();

    return from(this.afAuth.signInWithPopup(provider)).pipe(
      switchMap((userCredential) => {
        const firebaseUser = userCredential.user;
        if (!firebaseUser) {
          return of({
            type: 'error',
            message: 'Google login failed',
          } as LoginRequestError);
        }

        // Récupération du token Firebase sans await
        return from(firebaseUser.getIdToken()).pipe(
          switchMap((idToken) => {
            const tokenObj: IToken = { token: idToken };

            // Création / récupération du user dans Firestore
            return this.userService.getOrCreateUser(firebaseUser).pipe(
              switchMap((user) =>
                of({
                  type: 'success',
                  user,
                  token: tokenObj,
                  error: false,
                } as LoginRequestSuccess)
              )
            );
          })
        );
      })
    );
  }

  async signUp(email: string, password: string): Promise<string> {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    return userCredential.user?.getIdToken() ?? '';
  }

  async verifyToken(idToken: string): Promise<Observable<Object>> {
    return await this.http.post(`http://localhost:3000/verify-token`, {
      idToken,
    });
  }

  async signOut(): Promise<void> {
    await this.afAuth.signOut();
  }
}
