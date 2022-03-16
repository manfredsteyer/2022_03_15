import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { concatMap, map, switchMap } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';

import * as FlightBookingActions from './flight-booking.actions';
import { FlightService } from '@flight-workspace/flight-lib';
import { flightsLoaded, loadFlights } from './flight-booking.actions';

@Injectable()
export class FlightBookingEffects {

  loadFlights$ = createEffect(() => {
    return this.actions$.pipe( 
      ofType(loadFlights),
      switchMap(a => this.flightService.find(a.from, a.to)),
      map(flights => flightsLoaded({ flights }))
    );
  });

  constructor(
    private flightService: FlightService,
    private actions$: Actions) {}

}
