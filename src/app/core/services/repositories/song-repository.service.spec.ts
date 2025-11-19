import { TestBed } from '@angular/core/testing';
// Import Firebase mocks (par exemple avec `@angular/fire/testing` ou un mock custom)
import { provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

import { SongRepositoryService } from './song-repository.service';

describe('SongRepositoryService', () => {
  let service: SongRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SongRepositoryService],
      imports: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideFirestore(() => getFirestore()),
      ],
    });
    service = TestBed.inject(SongRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all songs from the database', async () => {
    const songs: IMusic[] = await service.getAllSongs();
    console.log('Fetched Songs:', songs); // Vérifier les données
    expect(songs).toBeInstanceOf(Array); // Vérifie que c'est un tableau
  });

  it('should retrieve a song by ID', async () => {
    const mockSongId = 'mockId'; // Remplace par un ID valide pour tester
    const song = await service.getSongById(mockSongId);
    console.log('Fetched Song:', song); // Vérifie que tu obtiens des données
    expect(song).toBeTruthy();
    expect(song?.id).toBe(mockSongId);
  });

  it('should add a new song to the database', async () => {
    const newSong: IMusic = {
      id: 'mockId2',
      title: 'Test Song',
      artistId: 'Test Artist',
      duration: '180',
      featuring: [],
      listeningCount: '',
      lyrics: '',
      cover: 'mock-url',
      url: 'https://firebasestorage.googleapis.com/v0/b/spotytest-e89c6.appspot.com/o/song%2F%5BPlaylist%5D%20%EC%9D%B4%20%EA%B0%80%EC%88%98%EB%8A%94%20%EC%96%B4%EB%95%8C%20%EC%9A%94%EC%95%84%EC%86%8C%EB%B9%84(YOASOBI)%20%EB%85%B8%EB%9E%98%EB%AA%A8%EC%9D%8C%20(J-POP)%20.mp3?alt=media&token=254a81a9-a722-410d-b459-0471bbd562e9',
    };

    await service.addSong(newSong);
    console.log('New Song Added');
    const song = await service.getSongById(newSong.id);
    expect(song).toEqual(newSong);
  });
});
