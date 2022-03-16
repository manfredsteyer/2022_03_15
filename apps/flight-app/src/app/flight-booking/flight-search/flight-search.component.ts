/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FlightService} from '@flight-workspace/flight-lib';
import { Store } from '@ngrx/store';
import { flightsLoaded, loadFlights } from '../+state/flight-booking.actions';
import { FlightBookingAppStateSlice, flightBookingFeatureKey } from '../+state/flight-booking.reducer';
import { selectAllFlights, selectAllFlights2, selectFilteredFlights } from '../+state/flight-booking.selectors';

@Component({
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  // changeDetection:ChangeDetectionStrategy.OnPush
})
export class FlightSearchComponent implements OnInit {

  from = 'Hamburg'; // in Germany
  to = 'Graz'; // in Austria
  urgent = false;

  // get flights() {
  //   return this.flightService.flights;
  // }

  flights$ = this.store.select(selectFilteredFlights);

  // "shopping basket" with selected flights
  basket: { [id: number]: boolean } = {
    3: true,
    5: true
  };

  constructor(
    private store: Store,
    private flightService: FlightService) {
  }

  ngOnInit() {
  }

  search(): void {
    if (!this.from || !this.to) return;
    this.store.dispatch(loadFlights({ from: this.from, to: this.to }));
  }

  delay(): void {
    this.flightService.delay();
  }

}

