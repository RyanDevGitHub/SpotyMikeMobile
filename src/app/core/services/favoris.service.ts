import { Injectable } from '@angular/core';
import { IFavorite } from '../interfaces/favorites';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavorisService {
  private storageKey = 'mesFavoris';
  private favoris$: BehaviorSubject<IFavorite[]> = new BehaviorSubject<
    IFavorite[]
  >([]);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.favoris$.next(JSON.parse(saved));
      } catch (e) {
        console.error('Erreur lecture favoris:', e);
        this.favoris$.next([]);
      }
    }
  }

  getAll(): Observable<IFavorite[]> {
    return this.favoris$.asObservable();
  }

  add(item: IFavorite): void {
    const current = this.favoris$.value ?? []; // sécurité
    if (!this.exists(item.id)) {
      const updated = [...current, item];

      this.updateStorage(updated);
    } else {
    }
  }

  remove(id: string): void {
    const updated = this.favoris$.value.filter((f) => f.id !== id);
    this.updateStorage(updated);
  }

  exists(id: string): boolean {
    return this.favoris$.value.some((f) => f.id === id);
  }

  private updateStorage(list: IFavorite[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(list));
    this.favoris$.next(list);
  }
}
