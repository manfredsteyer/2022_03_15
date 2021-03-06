import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, share } from 'rxjs';
import { Flight } from '../models/flight';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  
  // flights: Flight[] = [];
  private flightSubject = new BehaviorSubject<Flight[]>([]);
  readonly flights$ = this.flightSubject.asObservable();


  baseUrl = `http://www.angular.at/api`;
  // baseUrl = `http://localhost:3000`;

  reqDelay = 1000;

  constructor(private http: HttpClient) {}

  load(from: string, to: string, urgent: boolean): void {
 
    this.find(from, to, urgent).subscribe({
      next: (flights) => {

        // this.flights = flights;
        this.flightSubject.next(flights);

      },
      error: (err) => console.error('Error loading flights', err),
    });
  }

  find(
    from: string,
    to: string,
    urgent: boolean = false
  ): Observable<Flight[]> {
    // For offline access
    // let url = '/assets/data/data.json';

    // For online access
    let url = [this.baseUrl, 'flight'].join('/');

    if (urgent) {
      url = [this.baseUrl, 'error?code=403'].join('/');
    }

    const params = new HttpParams().set('from', from).set('to', to);

    const headers = new HttpHeaders().set('Accept', 'application/json');

    return this.http.get<Flight[]>(url, { params, headers });
    // return of(flights).pipe(delay(this.reqDelay))
  }

  findById(id: string): Observable<Flight> {
    const reqObj = { params: new HttpParams().set('id', id) };
    const url = [this.baseUrl, 'flight'].join('/');
    return this.http.get<Flight>(url, reqObj);
    // return of(flights[0]).pipe(delay(this.reqDelay))
  }

  save(flight: Flight): Observable<Flight> {
    const url = [this.baseUrl, 'flight'].join('/');
    return this.http.post<Flight>(url, flight);
  }

  delay() {
    const ONE_MINUTE = 1000 * 60;

    const oldFlights = this.flightSubject.getValue();
    const oldFlight = oldFlights[0];
    const oldDate = new Date(oldFlight.date);

    // Mutable
    // oldDate.setTime(oldDate.getTime() + 15 * ONE_MINUTE);
    // oldFlight.date = oldDate.toISOString();

    // Immutables

    const newDate = new Date(oldDate.getTime() + 15 * ONE_MINUTE);
    const newFlight = {...oldFlight, date: newDate.toISOString() }
    const newFlights = [newFlight, ...oldFlights.slice(1)];

    this.flightSubject.next(newFlights);

  }
}
