import { Component, Input, OnInit } from '@angular/core';
import {
  IonLabel,
  IonItemDivider,
  IonContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-lyrics-box',
  templateUrl: './lyrics-box.component.html',
  standalone: true,
  styleUrls: ['./lyrics-box.component.scss'],
  imports: [IonItemDivider, IonLabel, IonContent],
})
export class LyricsBoxComponent {
  @Input() lyrics: string;
  formattedLyrics: string;
  constructor() {}
  ngOnInit() {
    this.formattedLyrics = this.lyrics
      .replace(/\n/g, '<br>')
      .replace(/\[([^\]]+)\]/g, '<strong>[$1]</strong>');

    this.formattedLyrics = this.lyrics
      .split('\n')
      .map((line) => line.trim() || '<br>')
      .join('<br>');
  }
}
