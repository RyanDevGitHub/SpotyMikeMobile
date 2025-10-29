import { createAction, props } from '@ngrx/store';
import { IArtist } from '../../interfaces/user';

export const loadArtists = createAction('[Artists] Load Artists');

export const loadArtistsSuccess = createAction(
  '[Artists] Load Artists Success',
  props<{ artists: IArtist[] }>(),
);

export const loadArtistsFailure = createAction(
  '[Artists] Load Artists Failure',
  props<{ error: string }>(),
);
