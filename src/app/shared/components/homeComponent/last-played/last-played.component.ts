import { Component, inject, OnInit } from '@angular/core';
import { AppState } from '@capacitor/app';
import { Store } from '@ngrx/store';
import { PlayPageType } from 'src/app/core/interfaces/play-page-type';
import { ISong } from 'src/app/core/interfaces/song';
import { selectLastSongsByUser } from 'src/app/core/store/selector/song.selector';

import { SectionWithDropdownComponent } from '../../section-with-dropdown/section-with-dropdown.component';

@Component({
  selector: 'app-last-played',
  templateUrl: './last-played.component.html',
  standalone: true,
  styleUrls: ['./last-played.component.scss'],
  imports: [SectionWithDropdownComponent],
})
export class LastPlayedComponent implements OnInit {
  musicList: ISong[];
  store = inject(Store<AppState>);
  public pageType = PlayPageType.LastPlayed;

  constructor() {}

  ngOnInit() {
    console.log(this.pageType);
    this.store.select(selectLastSongsByUser).subscribe({
      next: (songs) => {
        this.musicList = songs; // Doit être un tableau
      },
      error: (err) => {
        console.error('[DEBUG] Error in subscription:', err);
      },
    });
    this.generateItems();
  }

  private generateItems() {}

  // onIonInfinite(ev: unknown) {}
}
