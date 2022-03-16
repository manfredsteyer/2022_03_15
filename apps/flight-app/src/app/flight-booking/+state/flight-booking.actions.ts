import { Flight } from '@flight-workspace/flight-lib';
import { createAction, props } from '@ngrx/store';

export const flightsLoaded = createAction(
  '[FlightBooking] flightsLoaded', // <-- UNIQUE!!!!
  props<{ flights: Flight[] }>()
);

export const loadFlights = createAction(
  '[FlightBooking] loadFlights', // <-- UNIQUE!!!!
  props<{ from: string; to: string }>()
);



