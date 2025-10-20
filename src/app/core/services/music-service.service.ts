import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, Subject } from 'rxjs';
import { SongRepositoryService } from './repositories/song-repository.service';
import { ISong } from '../interfaces/song';
import { AlbumsRepository } from './repositories/album-repository.service';
import { IAlbum } from '../interfaces/album';

@Injectable({
  providedIn: 'root',
})
@Injectable({ providedIn: 'root' })
export class MusicServiceService {
  private mediaInstance: any = null; // instance de la piste en cours
  private isPlayingSubject = new Subject<boolean>();
  isPlaying$ = this.isPlayingSubject.asObservable();

  constructor(
    private songRepository: SongRepositoryService,
    private albumRepository: AlbumsRepository
  ) {}

  // ============================
  // 🔹 Lecture / contrôle audio
  // ============================
  async play(url: string, title?: string, artist?: string) {
    if (this.mediaInstance) {
      await this.mediaInstance.destroy(); // stoppe et libère l'ancienne instance
    }

    // création de la nouvelle instance
    this.mediaInstance = await Media.create({ url, title, artist });

    await this.mediaInstance.play();
    this.isPlayingSubject.next(true);
  }

  async pause() {
    if (this.mediaInstance) {
      await this.mediaInstance.pause();
      this.isPlayingSubject.next(false);
    }
  }

  async resume() {
    if (this.mediaInstance) {
      await this.mediaInstance.play();
      this.isPlayingSubject.next(true);
    }
  }

  async stop() {
    if (this.mediaInstance) {
      await this.mediaInstance.destroy();
      this.isPlayingSubject.next(false);
      this.mediaInstance = null;
    }
  }

  async seek(position: number) {
    if (this.mediaInstance) {
      await this.mediaInstance.setCurrentTime({ position });
    }
  }

  async getDuration(): Promise<number> {
    if (this.mediaInstance) {
      const info = await this.mediaInstance.getCurrentPlayingMediaInfo();
      return info.duration || 0;
    }
    return 0;
  }

  async getCurrentTime(): Promise<number> {
    if (this.mediaInstance) {
      const info = await this.mediaInstance.getCurrentPlayingMediaInfo();
      return info.position || 0;
    }
    return 0;
  }

  // ============================
  // 🔹 Méthodes non liées à la lecture
  // ============================
  getSongs(): Observable<ISong[]> {
    return from(this.songRepository.getAllSongsWithArtist()).pipe(
      map((songs) => songs),
      catchError((error) => {
        console.error('Error in getSongs:', error);
        throw error;
      })
    );
  }

  getAlbums(): Observable<IAlbum[]> {
    return from(this.albumRepository.getAllAlbums()).pipe(
      map((albums) => albums),
      catchError((error) => {
        console.error('Error in getAlbums:', error);
        throw error;
      })
    );
  }

  getSongById(songId: string): Observable<ISong | null> {
    return from(this.songRepository.getSongById(songId));
  }

  addSong(song: ISong): Observable<void> {
    return from(this.songRepository.addSong(song));
  }
}
