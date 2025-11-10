import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { ISetting } from 'src/app/core/interfaces/setting';
import { LogOutComponent } from 'src/app/shared/components/button/log-out/log-out.component';
import { HeaderSettingComponent } from 'src/app/shared/components/headers/header-setting/header-setting.component';
import { ProfileItemComponent } from 'src/app/shared/components/profilComponent/profile-item/profile-item.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings-menu.page.html',
  styleUrls: ['./settings-menu.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonText,
    CommonModule,
    FormsModule,
    IonGrid,
    IonCol,
    IonRow,
    ProfileItemComponent,
    LogOutComponent,
    HeaderSettingComponent,
  ],
})
export class SettingsMenuPage implements OnInit {
  private router = inject(Router);
  settings: ISetting[] = [
    { name: 'Account', redirect: '/home/account' },
    { name: 'Languages', redirect: '/home/languages' },
    { name: 'Notification', redirect: '/home/notification' },
    { name: 'About', redirect: '/home/about' },
  ];
  constructor() {}

  ngOnInit() {
    addIcons({ chevronForwardOutline });
  }

  redirect(path: string) {
    this.router.navigate([path]);
  }
}
