import { Injectable } from '@angular/core';
import { EAuthPage } from '../models/refData';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private serverUrl = 'http://localhost:3000'; // URL de ton serveur Node.js

  constructor(private afAuth: AngularFireAuth, private http: HttpClient) {}
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
