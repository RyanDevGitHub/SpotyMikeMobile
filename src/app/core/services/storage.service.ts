import { Storage } from './../../../../node_modules/@angular/fire/storage/storage.d';
import { Injectable } from '@angular/core';

// IMPORTS MODERNES
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  StorageReference,
} from 'firebase/storage';
import { inject } from '@angular/core';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  // Injection du service Storage moderne
  private storage: Storage = inject(Storage);

  uploadFile(file: File, path: string): Observable<string> {
    const filePath = `${path}/${Date.now()}_${file.name}`; // Chemin unique // Création de la référence de fichier
    const fileRef: StorageReference = ref(this.storage, filePath); // Lancement de la tâche d'upload

    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Observable((observer) => {
      // Écouter les changements d'état (pour simuler la structure de l'ancien code)
      uploadTask.on(
        'state_changed', // (snapshot) => { /* logique de progression ici si nécessaire */ },
        (error) => {
          observer.error(error);
        },
        () => {
          // Complété : obtenir l'URL de téléchargement
          getDownloadURL(fileRef).then((url) => {
            observer.next(url); // URL du fichier
            observer.complete();
          });
        },
      );
    });
  }
}
