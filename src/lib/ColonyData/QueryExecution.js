/* @flow */

import type { Observable, PartialObserver } from 'rxjs';

import { from } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import type { Event, XtremeQuery3000 } from '~data/types';

/*
 * @todo Improve types for QueryExecution
 */
export default class QueryExecution {
  constructor(
    query: XtremeQuery3000<*, *, *, *>,
    context: Object,
    { args, metadata }: { args: *, metadata: * },
  ) {
    this.args = args || {};
    this.context = context || {};
    this.metadata = metadata || {};
    this.query = query;
  }

  query: XtremeQuery3000<*, *, *, *>;

  context: Object;

  args: *;

  metadata: *;

  _promise: ?Promise<*>;

  _observable: ?Observable<*>;

  get promise(): Promise<*> {
    if (!this._promise) {
      this._promise = (async () => {
        const deps = await this.query.prepare(
          this.context,
          this.metadata,
          this.args,
        );
        const events = await this.query.executeAsync(deps, this.args);
        return this.reduce(events);
      })();
    }

    return this._promise;
  }

  get observable(): Observable<*> {
    if (!this._observable) {
      const depsPromise = this.query.prepare(
        this.context,
        this.metadata,
        this.args,
      );

      this._observable = from(depsPromise).pipe(
        flatMap(deps => this.query.executeObservable(deps, this.args)),
      );
    }

    return this._observable;
  }

  then(onFulfilled: any => void, onRejected: (error: any) => void) {
    return this.promise.then(onFulfilled, onRejected);
  }

  catch(onRejected: (error: any) => void) {
    return this.promise.catch(error => {
      onRejected(error.message || error.toString());
    });
  }

  finally(onFinally: () => void) {
    return this.promise.finally(onFinally);
  }

  reduce(events: Event<*>[]) {
    return events.reduce(this.query.reducer, this.query.seed);
  }

  subscribe(observer: PartialObserver<*>) {
    return this.observable
      .pipe(map(events => this.reduce(events)))
      .subscribe(observer);
  }

  tap(observer: PartialObserver<*>) {
    return this.observable.subscribe(observer);
  }
}
