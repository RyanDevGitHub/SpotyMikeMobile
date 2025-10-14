import {
  Component,
  inject,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonCol,
  IonRow,
  IonText,
  IonImg,
  IonButton,
  IonButtons,
  IonIcon,
  IonSegmentButton,
  IonLabel,
  IonSegment,
} from '@ionic/angular/standalone';
import { MusicContainerComponent } from 'src/app/shared/components/containers/music-container/music-container.component';
import { ISong } from 'src/app/core/interfaces/song';
import { SectionWithDropdownComponent } from 'src/app/shared/components/section-with-dropdown/section-with-dropdown.component';
import { addIcons } from 'ionicons';
import { playOutline } from 'ionicons/icons';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import {
  filter,
  map,
  Observable,
  shareReplay,
  Subscription,
  take,
  tap,
} from 'rxjs';
import { BackButtonComponent } from 'src/app/shared/components/button/back-button/back-button.component';
import { selectArtistData } from 'src/app/core/store/selector/cross.selector';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { ActivatedRoute } from '@angular/router';
import { IAlbum } from 'src/app/core/interfaces/album';
import { IArtist } from 'src/app/core/interfaces/user';
import { AlbumContainerComponent } from 'src/app/shared/components/containers/album-container/album-container.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.page.html',
  styleUrls: ['./artist-page.page.scss'],
  standalone: true,
  imports: [
    IonSegment,
    IonLabel,
    IonSegmentButton,
    IonButton,
    IonImg,
    IonText,
    IonCol,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonRow,
    SectionWithDropdownComponent,
    MusicContainerComponent,
    IonButtons,
    IonIcon,
    AsyncPipe,
    BackButtonComponent,
    AlbumContainerComponent,
  ],
})
export class ArtistPagePage implements OnInit {
  public songList$: Observable<ISong[]>;
  public lastAlbumCover$: Observable<string | null>;
  public artist$: Observable<IArtist>;
  public albumList$: Observable<IAlbum[]>; // ✅ albums

  public selectedTab = signal<'music' | 'album'>('music');
  public isModalOpen: boolean;
  private store = inject(Store<AppState>);
  private route = inject(ActivatedRoute);
  public artistId: string;
  private modalSubscription: Subscription;

  @ViewChildren(MusicContainerComponent)
  musicComponents!: QueryList<MusicContainerComponent>;
  @ViewChildren(AlbumContainerComponent)
  albumComponents!: QueryList<AlbumContainerComponent>;

  constructor(private modalStateService: ModalStateService) {
    this.modalSubscription = modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value)
    );
  }

  ngOnInit() {
    addIcons({ playOutline });

    this.route.paramMap.subscribe((params) => {
      this.artistId = params.get('id')!;
      console.log('[ArtistPage] Param artistId:', this.artistId);

      if (this.artistId) {
        const artistData$ = this.store
          .select(selectArtistData(this.artistId))
          .pipe(
            tap((data) =>
              console.log('[ArtistPage] Full data from selector:', data)
            ),
            shareReplay(1) // ✅ garde la dernière valeur en cache
          );

        // On garde les observables pour le template
        this.artist$ = artistData$.pipe(
          map((data) => data.artist),
          filter((artist): artist is IArtist => artist !== null),
          shareReplay(1)
        );

        this.songList$ = artistData$.pipe(
          map((data) => data.songs),
          shareReplay(1)
        );

        this.albumList$ = artistData$.pipe(
          map((data) => data.albums),
          shareReplay(1)
        );

        this.lastAlbumCover$ = artistData$.pipe(
          map((data) => data.lastAlbumCover),
          shareReplay(1)
        );

        // 🔎 Debug direct via abonnement
        artistData$.subscribe((data) => {
          console.log('--- [ArtistPage] Debug subscribe ---');
          console.log('Artist:', data.artist);
          console.log('Songs:', data.songs);
          console.log('Albums:', data.albums);
          console.log('LastAlbumCover:', data.lastAlbumCover);
        });
      }
    });
  }

  onClick() {
    if (this.selectedTab() === 'music') {
      const musicArray = this.musicComponents.toArray();
      if (musicArray.length === 0) return;
      const randomIndex = Math.floor(Math.random() * musicArray.length);
      const randomMusicComp = musicArray[randomIndex];
      console.log('[ArtistPage] Playing random song:', randomMusicComp.song);
      randomMusicComp.openPlayer(); // appelle le modal du MusicContainer
    } else if (this.selectedTab() === 'album') {
      const albumArray = this.albumComponents.toArray();
      if (albumArray.length === 0) return;
      const randomIndex = Math.floor(Math.random() * albumArray.length);
      const randomAlbumComp = albumArray[randomIndex];
      console.log(
        '[ArtistPage] Redirecting to random album:',
        randomAlbumComp.album
      );
      randomAlbumComp.redirectToAlbum(); // navigation vers l'album
    }
  }

  onSegmentChange(ev: CustomEvent) {
    const value = ev.detail.value as 'music' | 'album';
    console.log('[ArtistPage] segment changed →', value);

    this.selectedTab.set(value); // met à jour le signal
  }
}
