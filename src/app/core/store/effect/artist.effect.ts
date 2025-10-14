import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  loadArtists,
  loadArtistsSuccess,
  loadArtistsFailure,
} from '../action/artist.action';
import {
  catchError,
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ArtistsRepository } from '../../services/repositories/artists-repository.service';
import { selectArtistsLoaded } from '../selector/artist.selector';

@Injectable()
export class ArtistsEffects {
  constructor(
    private actions$: Actions,
    private artistService: ArtistsRepository
  ) {}

  loadArtists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadArtists),
      switchMap(() =>
        from(this.artistService.getAllArtists()).pipe(
          // <- transforme la Promise en Observable
          tap((artists) => console.log('[Effect] Artists fetched:', artists)),
          map((artists) => loadArtistsSuccess({ artists })),
          catchError((error) =>
            of(loadArtistsFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
