import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonCol, IonGrid, IonRow, IonText } from '@ionic/angular/standalone';
import { HeaderSettingComponent } from 'src/app/shared/components/headers/header-setting/header-setting.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [
    IonText,
    IonCol,
    IonRow,
    IonGrid,
    CommonModule,
    FormsModule,
    HeaderSettingComponent,
  ],
})
export class AboutPage {
  version = environment.version;

  constructor() {}
}
