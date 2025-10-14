import { LocalStorageService } from './../../../core/services/local-strorage.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/core/services/storage.service';
import { SongRepositoryService } from 'src/app/core/services/repositories/song-repository.service';
import { ISong, SongGenre } from 'src/app/core/interfaces/song';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-song-modal',
  templateUrl: './add-song-modal.component.html',
  styleUrls: ['./add-song-modal.component.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonInput,
    ReactiveFormsModule,
    IonChip,
  ],
})
export class AddSongModalComponent {
  songForm: FormGroup;
  coverFile: File | null = null;
  songFile: File | null = null;
  genres = Object.values(SongGenre); // Liste des genres à afficher
  selectedGenre: SongGenre | null = null; // Genre sélectionné

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private songRepo: SongRepositoryService,
    private localStorageService: LocalStorageService,
    private modalController: ModalController
  ) {
    this.songForm = this.fb.group({
      title: ['', Validators.required],
      artistId: ['', Validators.required],
      duration: ['', Validators.required],
      featuring: [''], // Liste d'artistes en featuring
      lyrics: [''], // Paroles de la chanson
    });
  }

  onFileSelected(event: Event, type: 'cover' | 'file') {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      if (type === 'cover') {
        this.coverFile = target.files[0];
      } else if (type === 'file') {
        this.songFile = target.files[0];
        // Dès que le fichier song est sélectionné, on en extrait la durée
        this.getDurationFromMP3(this.songFile);
      }
    }
  }

  // Fonction pour récupérer la durée du fichier MP3 au format MM:SS
  getDurationFromMP3(file: File) {
    const audio = new Audio();
    const objectURL = URL.createObjectURL(file);
    audio.src = objectURL;

    audio.onloadedmetadata = () => {
      // Quand le fichier est chargé, on récupère la durée
      const durationInSeconds = Math.floor(audio.duration); // Durée en secondes entière
      const minutes = Math.floor(durationInSeconds / 60); // Calcul des minutes
      const seconds = durationInSeconds % 60; // Reste en secondes
      const formattedDuration = `${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; // Format MM:SS

      // Mettre à jour le formulaire avec la durée formatée
      this.songForm.patchValue({ duration: formattedDuration });
    };
  }

  async onSubmit() {
    // Vérification si les fichiers sont sélectionnés
    if (!this.coverFile) {
      console.error('Cover file is missing');
    }
    if (!this.songFile) {
      console.error('Song file is missing');
    }

    // Si tout est valide, procéder
    if (!this.coverFile || !this.songFile) {
      console.error('Form invalid or files missing');
      return;
    }

    try {
      const formValues = this.songForm.value;

      // Étape 1 : Récupérer l'utilisateur depuis le localStorage
      const userObservable: Observable<string | null> =
        this.localStorageService.getItem('user');

      userObservable.subscribe((user: any | null) => {
        // Utilisez 'any' si l'objet peut être de n'importe quel type
        if (user) {
          formValues.artistId = user.id; // Assurez-vous que 'user' a bien une propriété 'id'
        } else {
          console.error('User not found in localStorage');
          return; // Si l'utilisateur n'est pas trouvé dans le localStorage, on arrête le processus
        }
      });

      // Étape 2 : Uploader la cover et récupérer l'URL
      const coverUrl = await this.storageService
        .uploadFile(this.coverFile, 'covers')
        .toPromise();

      // Étape 3 : Uploader le fichier MP3 et récupérer l'URL
      const songUrl = await this.storageService
        .uploadFile(this.songFile, 'songs')
        .toPromise();

      // Étape 4 : Construire l'objet IMusic

      // const newSong: IMusicDate = {
      //   id: '', // Sera ajouté par le service

      //   title: formValues.title || '', // Valeur par défaut si undefined
      //   cover: coverUrl || '', // Si l'URL est undefined
      //   artistId: formValues.artistId || '', // Utilisation de l'artistId récupéré
      //   duration: formValues.duration || '', // Utilisation de la durée récupérée du MP3
      //   url: songUrl || '',
      //   featuring: formValues.featuring
      //     ? formValues.featuring.split(',').map((f: string) => f.trim())
      //     : [], // Garantir un tableau vide si undefined
      //   listeningCount: '0', // Valeur par défaut
      //   lyrics: formValues.lyrics || '',
      //   createAt: new Date(),
      //   genre: MusicGenre.Pop, // Valeur par défaut
      // };

      // Étape 5 : Ajouter dans la base de données
      // await this.songRepo.addSong(newSong);
      console.log('Song added successfully!');

      this.dismissModal();
    } catch (error) {
      console.error('Error adding song:', error);
    }
  }

  selectGenre(genre: SongGenre) {
    this.selectedGenre = genre;
    this.songForm.patchValue({ genre }); // Met à jour la valeur du formulaire
  }

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true, // Optionnel, pour passer des données lors de la fermeture
    });
    console.log('Modal dismissed');
  }
}
