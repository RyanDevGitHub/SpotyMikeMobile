import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SortState } from '../reducer/sort.reducer';

// 1️⃣ Sélectionner la feature 'sort' dans le store global
export const selectSortState = createFeatureSelector<SortState>('sort');

// 2️⃣ Sélectionner le tri d'une page donnée
export const selectSortForPage = (page: string) =>
  createSelector(
    selectSortState,
    (state) => state[page as keyof SortState] || null
  );

// 3️⃣ Exemple d’un selector générique : obtenir la clé et la direction
export const selectSortKeyAndDirection = (page: string) =>
  createSelector(selectSortForPage(page), (sort) => ({
    key: sort?.key || null,
    direction: sort?.direction || null,
  }));
