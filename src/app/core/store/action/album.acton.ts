// core/store/actions/album.actions.ts
import { createAction, props } from '@ngrx/store';

import { IAlbum } from '../../interfaces/album';

export const loadAlbums = createAction('[Album] Load Albums');
export const loadAlbumsSuccess = createAction(
  '[Album] Load Albums Success',
  props<{ albums: IAlbum[] }>(),
);
export const loadAlbumsFailure = createAction(
  '[Album] Load Albums Failure',
  props<{ error: string }>(),
);
