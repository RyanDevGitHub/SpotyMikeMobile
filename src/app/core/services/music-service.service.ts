import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, Subject } from 'rxjs';
import { SongRepositoryService } from './repositories/song-repository.service';
import { ISong } from '../interfaces/song';
import { AlbumsRepository } from './repositories/album-repository.service';
import { IAlbum } from '../interfaces/album';

@Injectable({
  providedIn: 'root',
})
export class MusicServiceService {
  constructor(
    private songRepository: SongRepositoryService,
    private albumRepository: AlbumsRepository
  ) {}
  private audio = new Audio();
  private isPlayingSubject = new Subject<boolean>();
  isPlaying$ = this.isPlayingSubject.asObservable();

  play(url: string) {
    this.audio.src = url;
    this.audio.load();
    this.audio.play();
  }
  pause() {
    this.audio.pause();
  }

  resume() {
    this.audio.play();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  isPlaying(): boolean {
    return !this.audio.paused;
  }

  getCurrentTime(): Observable<number> {
    return new Observable<number>((observer) => {
      this.audio.addEventListener('timeupdate', () => {
        observer.next(this.audio.currentTime);
      });
    });
  }

  async getDuration(): Promise<number> {
    return new Promise<number>((resolve) => {
      if (this.audio.duration > 0) {
        resolve(this.audio.duration);
      } else {
        this.audio.addEventListener('loadedmetadata', () => {
          resolve(this.audio.duration);
        });
      }
    });
  }
  seek(time: number) {
    this.audio.currentTime = time;
  }

  // Récupérer toutes les musiques
  getSongs(): Observable<ISong[]> {
    return from(this.songRepository.getAllSongsWithArtist()).pipe(
      map((songs) => {
        // Assurez-vous que les chansons sont un tableau et qu'il n'y a pas de mutation accidentelle des objets
        return songs;
      }),
      catchError((error) => {
        console.error('Error in getSongs:', error);
        throw error;
      })
    );
  }

  // Récupérer touts les albums
  getAlbums(): Observable<IAlbum[]> {
    return from(this.albumRepository.getAllAlbums()).pipe(
      map((songs) => {
        // Assurez-vous que les chansons sont un tableau et qu'il n'y a pas de mutation accidentelle des objets
        return songs;
      }),
      catchError((error) => {
        console.error('Error in getSongs:', error);
        throw error;
      })
    );
  }

  // Récupérer une musique par ID
  getSongById(songId: string): Observable<ISong | null> {
    return from(this.songRepository.getSongById(songId));
  }

  // Ajouter une musique
  addSong(song: ISong): Observable<void> {
    return from(this.songRepository.addSong(song));
  }
}
