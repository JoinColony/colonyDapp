/* @flow */
/* eslint-disable no-underscore-dangle */

import { BehaviorSubject } from 'rxjs';

import Store from './Store';

import type {
  EventIteratorOptions,
  OrbitDBEventStore,
  Entry,
  Event,
} from '~types';

/**
 * The wrapper Store class for orbit's eventlog store.
 */
class EventStore extends Store {
  static orbitType = 'eventlog';

  static decorateEntry({
    identity: { id: userAddress },
    payload: {
      value: { meta, ...event },
    },
  }: Entry) {
    return {
      ...event,
      meta: {
        ...meta,
        userAddress,
      },
    };
  }

  // https://github.com/babel/babel/issues/8417#issuecomment-415508558
  +_orbitStore: OrbitDBEventStore = this._orbitStore;

  _observable: ?BehaviorSubject<Event<*>[]>;

  get observable(): BehaviorSubject<Event<*>[]> {
    if (this._observable) {
      return this._observable;
    }

    this._observable = new BehaviorSubject<Event<*>[]>(this.all());

    const next = () => this.observable.next(this.all());

    // This isn't the most efficient way of getting the next value;
    // we're sacrificing performance for reliability.
    this._orbitStore.events.on('replicated', next);
    this._orbitStore.events.on('write', next);

    // Overload the store's close method to unsubscribe the observable.
    this._orbitStore.close = async () => {
      this.observable.unsubscribe();
      return this._orbitStore.close();
    };

    return this._observable;
  }

  /*
   @NOTE: for initialization purposes. The convention we're creating is that
   from within "infrastructure" layer we can only initialize. "service" layer
   can really append and fetch data
   */
  async init(value: {}) {
    return this.append(value);
  }

  async append(value: {}) {
    await this._orbitStore.add(value);
    return this.replicate();
  }

  getEvent(hash: string) {
    return this.constructor.decorateEntry(this._orbitStore.get(hash));
  }

  get(hashOrOptions: string | EventIteratorOptions) {
    return typeof hashOrOptions === 'string'
      ? this.getEvent(hashOrOptions)
      : this.all(hashOrOptions);
  }

  all(options: EventIteratorOptions = { limit: -1 }) {
    return this._orbitStore
      .iterator(options)
      .collect()
      .map(this.constructor.decorateEntry);
  }
}

export default EventStore;
