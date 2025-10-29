import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

interface ICache {
  [key: string]: BehaviorSubject<any>;
}
type serializable = object | Object;

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

  getItem<T extends serializable>(key: string): Observable<T | null> {
    if (this.cache[key]) {
      return this.cache[key].asObservable();
    } else {
      try {
        const data = JSON.parse(localStorage.getItem(key) ?? 'null');
        this.cache[key] = new BehaviorSubject<T | null>(data);
        return this.cache[key].asObservable();
      } catch (error) {
        return of(null); // Retourne un Observable avec une valeur `null`
      }
    }
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
    if (this.cache[key]) this.cache[key].next(undefined);
  }
}
