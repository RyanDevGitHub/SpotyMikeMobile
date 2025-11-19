import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ICache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: BehaviorSubject<any>;
}
type serializable = object | string | number | boolean;

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private cache: ICache;

  constructor() {
    this.cache = Object.create(null);
  }

  setItem<T extends serializable>(key: string, value: T): BehaviorSubject<T> {
    localStorage.setItem(key, JSON.stringify(value));

    if (this.cache[key]) {
      this.cache[key].next(value);
      return this.cache[key];
    }

    return (this.cache[key] = new BehaviorSubject(value));
  }

  getItem<T extends serializable>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(
        `Erreur lors de la lecture du localStorage pour la clé "${key}"`,
        error
      );
      return null;
    }
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
    if (this.cache[key]) this.cache[key].next(undefined);
  }
}
