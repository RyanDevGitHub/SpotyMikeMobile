import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { from, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ArtistsRepository } from '../../services/repositories/artists-repository.service';
import {
  loadArtists,
  loadArtistsFailure,
  loadArtistsSuccess,
} from '../action/artist.action';

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
