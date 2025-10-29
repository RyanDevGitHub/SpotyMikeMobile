// core/store/actions/song.action.ts
import { createAction, props } from '@ngrx/store';
import { ISong } from '../../interfaces/song';

export const loadSongsFromAlbums = createAction(
  '[Music] Load Songs From Albums',
);
export const loadSongSuccess = createAction(
  '[Music] Load Song Success',
  props<{ songs: ISong[] }>(),
);
export const loadSongFailure = createAction(
  '[Music] Load Song Failure',
  props<{ error: string }>(),
);
