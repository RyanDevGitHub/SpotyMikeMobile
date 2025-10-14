import { selectUserPlaylists } from './../../../core/store/selector/user.selector';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonAvatar,
  IonRadio,
  IonCheckbox,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { ISong } from 'src/app/core/interfaces/song';
import {
  IPlaylist,
  IPlaylistWithSelection,
} from 'src/app/core/interfaces/playlistes';
import {
  IonContent,
  IonList,
  IonButton,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { AppState } from '@capacitor/app';
import { AsyncPipe } from '@angular/common';
import { CreatePlaylistComponent } from '../create-playlist/create-playlist.component';
import {
  addSongToPlaylist,
  removeSongFromPlaylist,
} from 'src/app/core/store/action/user.action';
import { firstValueFrom, map } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-to-playlist',
  templateUrl: './add-to-playlist.component.html',
  styleUrls: ['./add-to-playlist.component.scss'],
  standalone: true,
  imports: [
    IonCheckbox,
    IonRadio,
    IonAvatar,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonLabel,
    IonItem,
    IonButton,
    IonList,
    IonContent,
    AsyncPipe,
    FormsModule,
  ],
})
export class AddToPlaylistComponent implements OnInit {
  @Input() song!: ISong;
  store = inject(Store<AppState>);
  playlists: IPlaylistWithSelection[] = []; // ✅ tableau local mutable

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}
  ionViewWillEnter() {
    console.log('ION VIEW WILL ENTER 🎵:', this.song); // ici la prop est bien dispo
  }
  ngOnInit() {
    console.log('🎵 Musique reçue:', this.song);
    this.store.select(selectUserPlaylists).subscribe((playlists) => {
      // On clone les playlists et on ajoute selected si besoin
      this.playlists = playlists.map((p) => ({
        ...p,
        selected: p.songs?.some((s) => s.id === this.song.id) || false,
      }));
      console.log('🎵 Playlists depuis le store:', this.playlists);
    });
  }

  logSelectedPlaylists() {
    const selected = this.playlists.filter((p) => p.selected);
    console.log(
      '✅ Playlists cochées:',
      selected.map((p) => p.id)
    );
  }

  async apply() {
    const selectedPlaylists = this.playlists.filter((p) => p.selected);
    const unselectedPlaylists = this.playlists.filter((p) => !p.selected);

    // 1️⃣ Ajouter les musiques manquantes
    for (const playlist of selectedPlaylists) {
      const alreadyExists = playlist.songs?.some((s) => s.id === this.song.id);
      if (!alreadyExists) {
        this.store.dispatch(
          addSongToPlaylist({ playlistId: playlist.id, song: this.song })
        );
      }
    }

    // 2️⃣ Supprimer les musiques décochées
    for (const playlist of unselectedPlaylists) {
      const exists = playlist.songs?.some((s) => s.id === this.song.id);
      if (exists) {
        this.store.dispatch(
          removeSongFromPlaylist({
            playlistId: playlist.id,
            songId: this.song.id,
          })
        );
      }
    }

    this.modalCtrl.dismiss();

    const toast = await this.toastCtrl.create({
      message: '🎵 Les playlists ont été mises à jour !',
      duration: 2000,
      color: 'success',
      position: 'top',
    });
    toast.present();
  }

  async dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  async openCreatePlaylist() {
    const modal = await this.modalCtrl.create({
      component: CreatePlaylistComponent,
      componentProps: {
        song: this.song,
      },
      cssClass: 'custom-create-playlist-modal',
    });
    await modal.present();
  }
}
