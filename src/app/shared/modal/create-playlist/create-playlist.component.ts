import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { ISong } from 'src/app/core/interfaces/song';
import { createPlaylist } from 'src/app/core/store/action/user.action';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class CreatePlaylistComponent {
  @Input() song!: ISong;
  playlistName = '';

  constructor(
    private store: Store,
    private modalCtrl: ModalController,
  ) {} // 👈 injecte ici

  close() {
    this.modalCtrl.dismiss();
  }

  ionViewWillEnter() {
    console.log('ION VIEW WILL ENTER 🎵:', this.song); // ici la prop est bien dispo
  }
  create() {
    console.log(
      '🚀 Création playlist déclenchée, titre:',
      this.playlistName,
      'song:',
      this.song,
    );

    if (!this.playlistName.trim()) {
      console.warn('⚠️ Nom de playlist vide, création annulée');
      return;
    }

    this.store.dispatch(
      createPlaylist({ title: this.playlistName, song: this.song }),
    );

    console.log('✅ Action createPlaylist dispatchée');
    this.modalCtrl.dismiss();
  }
}
