import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderSettingComponent } from 'src/app/shared/components/headers/header-setting/header-setting.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderSettingComponent],
})
export class AccountPage {
  constructor() {}
}
