import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromFlightBooking from './flight-booking.reducer';
import { FlightBookingAppStateSlice, flightBookingFeatureKey } from './flight-booking.reducer';

export const selectFlightBookingState = createFeatureSelector<fromFlightBooking.FlightBookingState>(
  fromFlightBooking.flightBookingFeatureKey
);

export const selectAllFlights3 = createSelector(
  selectFlightBookingState,
  fbs => fbs.flights
);

export const selectHideList = createSelector(
  selectFlightBookingState,
  fbs => fbs.hideList
);

export const selectFilteredFlights = createSelector(
  selectAllFlights3,
  selectHideList,
  (flights, hideList) => flights.filter(f => !hideList.includes(f.id))
);

export const selectAllFlights = 
  (root: FlightBookingAppStateSlice) => 
    root[flightBookingFeatureKey].flights;


export const selectAllFlights2 = createSelector(
  (root: FlightBookingAppStateSlice) => root[flightBookingFeatureKey].flights,
  (root: FlightBookingAppStateSlice) => root[flightBookingFeatureKey].hideList,
  (flights, hideList) => flights.filter(f => !hideList.includes(f.id))
);