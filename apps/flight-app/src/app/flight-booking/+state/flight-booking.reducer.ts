import { Flight } from '@flight-workspace/flight-lib';
import { Action, createReducer, on } from '@ngrx/store';
import * as FlightBookingActions from './flight-booking.actions';
import { flightsLoaded } from './flight-booking.actions';

export const flightBookingFeatureKey = 'flightBooking';

export interface FlightBookingAppStateSlice {
  [flightBookingFeatureKey]: FlightBookingState;
}

export interface FlightBookingState {
  flights: Flight[];
  hideList: number[];
  basket: object;
  stats: object;
}

export const initialState: FlightBookingState = {
  flights: [],
  hideList: [4],
  basket: {},
  stats: {}
};

export const reducer = createReducer(
  initialState,

  on(flightsLoaded, (state, action) => {

    const flights = action.flights;
    return { ...state, flights, x:1 } as FlightBookingState;

    // state.flights = action.flights;

  }),

);
