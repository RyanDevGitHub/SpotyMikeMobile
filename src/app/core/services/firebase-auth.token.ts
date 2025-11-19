import { InjectionToken } from '@angular/core';
import { Auth } from 'firebase/auth';

/**
 * Jeton d'injection explicite pour le service Firebase Auth (Auth SDK V9).
 * Ce jeton est utilisé dans les services et composants (comme LoginPage et AuthService)
 * pour injecter l'instance Auth sans conflit de type/valeur.
 */
export const FirebaseAuthToken = new InjectionToken<Auth>(
  'firebase.auth.token',
);
