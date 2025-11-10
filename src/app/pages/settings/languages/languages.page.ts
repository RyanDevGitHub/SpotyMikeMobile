import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { HeaderSettingComponent } from 'src/app/shared/components/headers/header-setting/header-setting.component';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.page.html',
  styleUrls: ['./languages.page.scss'],
  standalone: true,
  imports: [
    IonText,
    IonIcon,
    IonCol,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    HeaderSettingComponent,
    IonBackButton,
    IonGrid,
    IonRow,
    IonModal,
    IonButton,
    IonList,
    IonItem,
    IonAvatar,
    IonImg,
    IonLabel,
  ],
})
export class LanguagesPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  constructor() {}

  ngOnInit() {
    addIcons({ chevronForwardOutline });
  }

  openModal() {}

  closeModal() {
    this.modal.dismiss(null, 'cancel');
  }
}
