import { createAction, props } from '@ngrx/store';

export type SortKey = 'title' | 'artist' | 'album' | 'date' | 'listeningCount';

export const setSort = createAction(
  '[Sort] Set Sort',
  props<{ page: string; key: SortKey; direction: 'asc' | 'desc' }>()
);

export const clearSort = createAction(
  '[Sort] Clear Sort',
  props<{ page: string }>()
);
export const changeSort = createAction(
  '[Sort] Change Sort',
  props<{ page: string; criterion: 'Titre' | 'Artist' | 'Album' }>()
);

export const resetSort = createAction(
  '[Sort] Reset Sort',
  props<{ page: string }>()
);
