import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, combineLatest, interval, Observable, of, ReplaySubject, Subject, Subscription, throwError } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { catchError, concatMap, debounceTime, delay, distinctUntilChanged, exhaustMap, filter, map, mergeMap, share, shareReplay, startWith, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { Flight } from '@flight-workspace/flight-lib';

// import { concatLatestFrom } from '@ngrx/effects';

function trace(prefix: string) {
    console.debug('Setting up logger', prefix);

    return function (obj$: Observable<any>) {
        return obj$.pipe(tap(x => console.log(prefix, x)));
    }

}


function trace2(prefix: string) {
    console.debug('Setting up logger', prefix);

    return function (in$: Observable<any>) {
        
        //return obj$.pipe(tap(x => console.log(prefix, x)));
        // Ausgehnd
        return new Observable(out => {
            const sub = in$.subscribe(next => {
                console.log(prefix, next);
                if (next) {
                    out.next(next);
                }
            });

            return () => {
                sub.unsubscribe();
            }
        });
    }

}

type Pred = (x: any) => boolean;

function myFilter(p: Pred) {
    return function (in$: Observable<any>): Observable<string> {
        
        //return obj$.pipe(tap(x => console.log(prefix, x)));
        // Ausgehnd
        return new Observable(out => {
            in$.subscribe(next => {
               if (p(next)) {
                    out.next(next);
                }
            });
        })
    }

}


@Component({
    selector: 'flight-lookahead',
    templateUrl: './flight-lookahead.component.html'
})
export class FlightLookaheadComponent implements OnInit, OnDestroy {

    close$ = new Subject<void>();

    constructor(private http: HttpClient) {

        const sub = new BehaviorSubject<string>('INIT');

        sub.next("Y");
        sub.next("Z");
        sub.next("A");
        sub.subscribe(x => console.log(x));
        sub.next("B");

    }

    ngOnDestroy(): void {
        this.close$.next();
    }

    control!: FormControl;
    flights$!: Observable<Flight[]>;
    // loading = false;

    loading$ = new BehaviorSubject<boolean>(true);

    // TODO: Get rid of online
    online$!: Observable<boolean>;

    ngOnInit() {

        this.control = new FormControl();

        // Cold: 1:1, lazy
        // RxJS 7 =< 13.0.0
        this.online$ = interval(1000).pipe(
            startWith(0),
            //tap(x => console.debug('counter', x)),
            map(_ => Math.random() < 0.5),  // t, t, t, f, f, t
            map(x => true),
            distinctUntilChanged(), // t, f, t
            share({
                connector: () => new ReplaySubject(1),
                resetOnRefCountZero: true,
                resetOnComplete: true,
                resetOnError: true
            })
            //shareReplay({ bufferSize: 1, refCount: true })
        );

        this.online$.pipe(takeUntil(this.close$)).subscribe(x => {
            console.debug('next', x);
        });

        // setTimeout(() => sub.unsubscribe(), 7000);

        const input$ = this.control.valueChanges.pipe(
            filter(v => v.length > 0),
            debounceTime(300),
            distinctUntilChanged()
        );

        // RxJS 7 =< Angular 13
        this.flights$ = combineLatest({input: input$, online: this.online$}).pipe(
            filter( combined => combined.online ),
            trace('vor map in flights$'),
            map( combined => combined.input ),
            myFilter(x => x !== 'Wien'),
            tap(v => this.loading$.next(true)),
            switchMap(name => this.load(name)),
            tap(v => this.loading$.next(false))
        );
    
        // // RxJS 7 =< Angular 13
        // this.flights$ = combineLatest({input: input$, online: this.online$}).pipe(
        //     filter( combined => combined.online ),
        //     map( combined => combined.input ),
        //     tap(v => this.loading$.next(true)),
        //     switchMap(name => this.load(name)),
        //     tap(v => this.loading$.next(false))
        // );

        // this.flights$ = input$.pipe(    // <-- active
        //     withLatestFrom(this.online$),   // <-- passiv
        //     filter( ([input, online]) => online ),
        //     map( ([input, online]) => input ),
        //     tap(v => this.loading = true),
        //     switchMap(name => this.load(name)),
        //     tap(v => this.loading = false)
        // );
    
    }

    load(from: string)  {
        const url = "http://www.angular.at/api/flight";

        const params = new HttpParams()
                            .set('from', from);

        const headers = new HttpHeaders()
                            .set('Accept', 'application/json');

        return this.http.get<Flight[]>(url, {params, headers}).pipe(
            // delay(7000)
            catchError(err => {
                console.error('err', err);
                return of([]);
            }), 
        )

    };


}
