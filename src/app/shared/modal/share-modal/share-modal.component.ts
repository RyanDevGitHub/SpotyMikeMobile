import { Component, Input } from '@angular/core';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { ToastController } from '@ionic/angular';
import {
  IonAvatar,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  standalone: true,
  styleUrls: ['./share-modal.component.scss'],
  imports: [IonText, IonIcon, IonCol, IonAvatar, IonRow, IonGrid],
})
export class ShareModalComponent {
  @Input() id: string;
  shareUrl = 'https://spotymike.app/track/zelda-hits';

  constructor(private toastCtrl: ToastController) {}

  // 1. Fonction pour le bouton "Lien" (Copier)
  async copyLink() {
    console.log('Bouton Copier cliqué !');
    await Clipboard.write({
      string: this.shareUrl,
    });
    this.presentToast('Lien copié dans le presse-papier !');
  }

  // 2. Fonction pour le bouton "Message / Natif" (Le bouton bleu ou gris selon ton choix)
  async shareNatively() {
    const canShare = await Share.canShare();

    if (canShare.value) {
      await Share.share({
        title: 'Nouvelle Musique sur SpotyMike',
        text: "Écoute ça, c'est incroyable !",
        url: this.shareUrl,
        dialogTitle: 'Partager avec',
      });
    } else {
      // Fallback si le navigateur ne supporte pas le partage natif
      this.copyLink();
    }
  }

  // 3. Partage spécifique (WhatsApp / Twitter)
  shareToSocial(platform: 'whatsapp' | 'twitter') {
    let url = '';
    const text = encodeURIComponent('Écoute cette musique sur SpotyMike ! ');

    if (platform === 'whatsapp') {
      url = `https://wa.me/?text=${text}${this.shareUrl}`;
    } else if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${text}&url=${this.shareUrl}`;
    }

    window.open(url, '_blank');
  }

  // Petit utilitaire pour le feedback visuel
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      cssClass: 'custom-toast', // Tu peux styliser ça dans ton CSS
    });
    await toast.present();
  }
}
