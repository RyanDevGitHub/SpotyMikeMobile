import { createReducer, on } from '@ngrx/store';
import * as SortActions from '../action/sort.action';

export interface SortState {
  favoris: { key: SortActions.SortKey; direction: 'asc' | 'desc' };
  top_songs: { key: SortActions.SortKey; direction: 'asc' | 'desc' };
  albums: { key: SortActions.SortKey; direction: 'asc' | 'desc' };
  lastPlayed: { key: SortActions.SortKey; direction: 'asc' | 'desc' };
  music_genre: { key: SortActions.SortKey; direction: 'asc' | 'desc' };
}

export const initialSortState: SortState = {
  favoris: { key: 'title', direction: 'asc' },
  top_songs: { key: 'title', direction: 'asc' },
  albums: { key: 'artist', direction: 'asc' },
  lastPlayed: { key: 'title', direction: 'asc' },
  music_genre: { key: 'title', direction: 'asc' },
};

export const sortReducer = createReducer(
  initialSortState,

  on(SortActions.setSort, (state, { page, key, direction }) => ({
    ...state,
    [page]: { key, direction },
  })),

  on(SortActions.clearSort, (state, { page }) => ({
    ...state,
    [page]: null,
  })),

  on(SortActions.changeSort, (state, { page, criterion }) => {
    const mapping: Record<string, SortActions.SortKey> = {
      Titre: 'title',
      Artist: 'artist',
      Album: 'album',
    };

    const newKey = (mapping[criterion] ?? 'title') as SortActions.SortKey;

    const current = state[page as keyof SortState];
    const newDirection: 'asc' | 'desc' =
      current && current.key === newKey && current.direction === 'asc'
        ? 'desc'
        : 'asc';

    return {
      ...state,
      [page]: { key: newKey, direction: newDirection },
    };
  }),

  on(SortActions.resetSort, (state, { page }) => ({
    ...state,
    [page]: null,
  })),
);
