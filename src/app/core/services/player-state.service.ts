import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';

import { PlayContext, PlayPageType } from '../interfaces/play-page-type';
import { AppState } from '../store/app.state';
import {
  selectAlbumIdBySongId,
  selectSongsByAlbumId,
} from '../store/selector/album.selector';
import { selectSortedFavorites } from '../store/selector/favorites.selector';
import {
  selectFilteredAndSortedSongsByGenre,
  selectRecentSongs,
  selectSortedLastPlayedSongs,
  selectSortedTopSongs,
} from '../store/selector/song.selector';
import { ISong } from './../interfaces/song';
import { MusicServiceService } from './music-service.service';
@Injectable({ providedIn: 'root' })
export class PlayerStateService {
  private currentSongSubject = new BehaviorSubject<ISong | null>(null);
  currentSong$ = this.currentSongSubject.asObservable();

  private miniPlayerVisibleSubject = new BehaviorSubject<boolean>(false);
  miniPlayerVisible$ = this.miniPlayerVisibleSubject.asObservable();

  private currentTrackList: ISong[] = [];
  private currentPlayContext: PlayContext | null = null;

  musicService = inject(MusicServiceService); // injection du MusicService
  private store = inject(Store<AppState>);
  constructor() {
    // On écoute si la musique est en cours pour afficher/masquer le mini-player
    this.musicService.isPlaying$.subscribe((isPlaying) => {
      if (isPlaying && this.currentSongSubject.value) {
        // this.setMiniPlayer(true);
      } else if (!isPlaying) {
        // this.setMiniPlayer(false);
      }
    });
  }

  setTrackList(list: ISong[], context: PlayContext) {
    this.currentTrackList = list;
    this.currentPlayContext = context;
    console.log(
      `[PlayerState] Liste de lecture mise à jour. ${list.length} morceaux.`
    );
  }

  // 🆕 MÉTHODE POUR NAVIGUER (LOGIQUE DÉPLACÉE DE PlaySongPage)
  navigate(direction: 'next' | 'prev' | 'shuffle') {
    console.log(this.currentSongSubject.value, this.currentTrackList);
    const currentSong = this.currentSongSubject.value;
    const trackList = this.currentTrackList;

    if (!currentSong || trackList.length === 0) {
      console.warn(
        '[PlayerState Navigation] Navigation impossible: Morceau ou liste vide.'
      );
      console.log(currentSong, trackList.length);
      return;
    }

    const currentIndex = trackList.findIndex((t) => t.id === currentSong.id);
    let newIndex: number;

    if (currentIndex === -1) {
      console.error(`❌ [PlayerState Debug] IDs de comparaison:`);
      console.error(
        `- ID du morceau actuel (currentSong.id): ${currentSong.id}`
      );
      console.error(
        `- Liste des IDs dans trackList: ${trackList
          .map((t) => t.id)
          .join(', ')}`
      );

      console.error(
        '[PlayerState Navigation] Morceau actuel introuvable dans la liste.'
      );
      return;
    }

    // --- LOGIQUE DE CALCUL D'INDEX (SIMPLIFIÉE) ---
    if (direction === 'shuffle') {
      let randomIndex: number;
      do {
        randomIndex = Math.floor(Math.random() * trackList.length);
      } while (randomIndex === currentIndex && trackList.length > 1);
      newIndex = randomIndex;
    } else if (direction === 'next') {
      newIndex = (currentIndex + 1) % trackList.length; // Boucle
    } else {
      // 'prev'
      newIndex = (currentIndex - 1 + trackList.length) % trackList.length; // Boucle
    }
    // ----------------------------------------------

    const nextOrPrevSong = trackList[newIndex];

    if (nextOrPrevSong) {
      console.log(
        `✅ [PlayerState Navigation] Passage au morceau: ${nextOrPrevSong.title}`
      );

      // 1. Mettre à jour l'état du morceau dans le service
      this.setCurrentSong(nextOrPrevSong);

      // 2. Charger et jouer le nouveau morceau
      this.musicService.loadAndPlay(nextOrPrevSong);

      // 3. (Optionnel) Dispatcher l'action de "Dernière chanson jouée"
      // Note: Vous n'avez pas l'ID utilisateur ici, vous devrez peut-être le stocker ou le récupérer.
      // this.store.dispatch(addLastSongUser({ songId: nextOrPrevSong.id }));
    }
  }

  setCurrentSong(song: ISong) {
    // Mettre à jour la source de vérité
    this.currentSongSubject.next(song);
  }
  getCurrentPlayContext(): PlayContext | null {
    return this.currentPlayContext;
  }

  getCurrentTrackList(): ISong[] {
    return this.currentTrackList;
  }
  getCurrentSong(): ISong | null {
    return this.currentSongSubject.getValue();
  }
  setMiniPlayer(visible: boolean) {
    this.miniPlayerVisibleSubject.next(visible);
  }

  getTrackListForContext(
    context: PlayContext,
    music: ISong
  ): Observable<ISong[]> {
    // Fonction utilitaire pour retourner un Observable vide
    const emptyObservable = new Observable<ISong[]>((subscriber) => {
      subscriber.next([]);
      subscriber.complete();
    });

    switch (context.type) {
      // --- CAS AVEC TRI (Ils utilisent le SortState) ---

      case PlayPageType.Favori:
        // 💡 UTILISE LE SÉLECTEUR TRIÉ ET N'EXTRAIT QUE LES CHANSONS
        return this.store.pipe(
          select(selectSortedFavorites),
          map((favorites) => favorites.songs)
        );

      case PlayPageType.TopSongs:
        // 💡 UTILISE LE SÉLECTEUR TRIÉ
        return this.store.pipe(select(selectSortedTopSongs));

      case PlayPageType.LastPlayed:
        // 💡 UTILISE LE SÉLECTEUR TRIÉ
        return this.store.pipe(select(selectSortedLastPlayedSongs));

      case PlayPageType.GenrePop:
        // 💡 UTILISE LE SÉLECTEUR FILTRÉ ET TRIÉ
        return this.store.pipe(
          select(selectFilteredAndSortedSongsByGenre('Pop'))
        );

      case PlayPageType.GenreRock:
        // 💡 UTILISE LE SÉLECTEUR FILTRÉ ET TRIÉ
        return this.store.pipe(
          select(selectFilteredAndSortedSongsByGenre('Rock'))
        );

      case PlayPageType.GenreJazz:
        // 💡 UTILISE LE SÉLECTEUR FILTRÉ ET TRIÉ
        return this.store.pipe(
          select(selectFilteredAndSortedSongsByGenre('Jazz'))
        );

      case PlayPageType.GenreAll:
        // 💡 UTILISE LE SÉLECTEUR FILTRÉ ET TRIÉ
        return this.store.pipe(
          select(selectFilteredAndSortedSongsByGenre('All'))
        );

      case PlayPageType.NewSongs:
        // ⚠️ On utilise ici selectRecentSongs, qui trie par date de création, mais PAS par SortState.
        // Si vous avez un sélecteur trié par SortState pour les NewSongs, remplacez-le.
        return this.store.pipe(select(selectRecentSongs));

      // --- CAS SANS TRI (Utilisent les sélecteurs normaux par ID) ---

      case PlayPageType.Playlist:
      case PlayPageType.Album:
      case PlayPageType.Artist:
        if (context.type === PlayPageType.Album) {
          console.log(`Starting Album lookup using Song ID:`, context.sourceId);

          return this.store.pipe(
            // 1. Utiliser l'ID de la Chanson pour trouver l'ID de l'Album
            select(selectAlbumIdBySongId(context.sourceId!)),

            // 2. Utiliser l'ID de l'Album trouvé (ou null) pour obtenir la liste de chansons
            switchMap((albumId) => {
              if (!albumId) {
                console.warn(
                  `Album ID non trouvé pour la chanson ID: ${context.sourceId!}.`
                );
                return of([]); // Retourne un Observable de tableau vide
              }

              console.log(
                `Found Album ID: ${albumId}. Fetching songs for this Album.`
              );
              // 3. Appel du sélecteur original avec le bon ID d'Album
              return this.store.pipe(
                select(selectSongsByAlbumId(albumId as string))
              );
            })
          );
        }
        break;

      // --- Cas Spéciaux ---

      case PlayPageType.Independently:
        if (music) {
          return new Observable<ISong[]>((subscriber) => {
            subscriber.next([music]);
            subscriber.complete();
          });
        }
        break;

      default:
        console.warn(
          `[TrackList Select] PlayPageType non géré ou inconnu: ${context.type}`
        );
        return emptyObservable;
    }

    return emptyObservable;
  }
}
