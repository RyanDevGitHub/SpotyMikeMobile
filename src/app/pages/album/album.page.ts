import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@capacitor/app';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonRow,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { Subscription, tap } from 'rxjs';
import { IAlbum } from 'src/app/core/interfaces/album';
import {
  PlayContext,
  PlayPageType,
} from 'src/app/core/interfaces/play-page-type';
import { ISong } from 'src/app/core/interfaces/song';
import { IArtist } from 'src/app/core/interfaces/user';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { selectAlbumById } from 'src/app/core/store/selector/album.selector';
import { selectArtistById } from 'src/app/core/store/selector/artist.selector';
import { BackButtonComponent } from 'src/app/shared/components/button/back-button/back-button.component';
import { MusicContainerComponent } from 'src/app/shared/components/containers/music-container/music-container.component';

@Component({
  selector: 'app-album',
  templateUrl: './album.page.html',
  styleUrls: ['./album.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonCol,
    IonImg,
    IonRow,
    IonGrid,
    IonContent,
    CommonModule,
    FormsModule,
    MusicContainerComponent,
    BackButtonComponent,
  ],
})
export class AlbumPage implements OnInit {
  @Input() album!: IAlbum;
  artist?: IArtist;
  duration: string = '0 min';
  public isModalOpen: boolean;
  private modalSubscription: Subscription;
  pageType = PlayPageType.Album;
  playContext: PlayContext;
  @ViewChildren(MusicContainerComponent)
  musicComponents!: QueryList<MusicContainerComponent>;

  constructor(
    private modalStateService: ModalStateService,
    private store: Store<AppState>,
    private route: ActivatedRoute
  ) {
    this.modalSubscription = modalStateService.modalOpen$.subscribe(
      (val) => (this.isModalOpen = val)
    );
  }

  ngOnInit() {
    const albumId = this.route.snapshot.paramMap.get('id')!;
    this.playContext = { type: this.pageType, sourceId: albumId };
    this.store
      .select(selectAlbumById(albumId))
      .pipe(tap((alb) => console.log('[DEBUG] album:', alb)))
      .subscribe((alb) => {
        if (alb) {
          this.album = alb;
          this.duration = this.calcDuration(alb.songs);
          this.loadArtist(alb.artistId);
        }
      });
  }

  loadArtist(artistId: string) {
    this.store
      .select(selectArtistById(artistId))
      .pipe(tap((art) => console.log('[DEBUG] artist:', art)))
      .subscribe((art) => (this.artist = art));
  }

  calcDuration(songs: ISong[]): string {
    const totalSec = songs.reduce((acc, s) => acc + Number(s.duration), 0);
    return Math.floor(totalSec / 60) + ' min';
  }

  playAlbum() {
    const musicArray = this.musicComponents.toArray();
    if (musicArray.length === 0) return;
    const randomIndex = Math.floor(Math.random() * musicArray.length);
    const randomMusicComp = musicArray[randomIndex];
    console.log('[ArtistPage] Playing random song:', randomMusicComp.song);
    randomMusicComp.openPlayer(); // appelle le modal du MusicContainer
  }
}
