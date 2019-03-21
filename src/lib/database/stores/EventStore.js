/* @flow */

import Store from './Store';

import type { EventIteratorOptions, OrbitDBEventStore } from '../types';

/**
 * The wrapper Store class for orbit's eventlog store.
 */
class EventStore extends Store {
  static orbitType = 'eventlog';

  // https://github.com/babel/babel/issues/8417#issuecomment-415508558
  +_orbitStore: OrbitDBEventStore = this._orbitStore;

  // TODO We need to check how flow can help here
  /*
   @NOTE: for initialization purposes. The convention we're creating is that
   from within "infrastructure" layer we can only initialize. "service" layer
   can really append and fetch data
   */
  async init(value: {}) {
    return this.append(value);
  }

  async query(filter: * = {}) {
    return this._orbitStore
      .iterator(filter)
      .collect()
      .reduce(
        (events, event) => [
          ...events,
          ...((event &&
            event.next &&
            event.next.length &&
            event.next.map(hash => this._orbitStore.get(hash))) ||
            []),
          event,
        ],
        [],
      )
      .map(event => event.payload.value);
  }

  async append(value: {}) {
    return this._orbitStore.add(value);
  }

  get(hashOrOptions: string | EventIteratorOptions) {
    return typeof hashOrOptions === 'string'
      ? this._orbitStore.get(hashOrOptions)
      : this.all(hashOrOptions);
  }

  all(options: EventIteratorOptions = { limit: -1 }) {
    return this._orbitStore
      .iterator(options)
      .collect()
      .map(item => item.payload.value);
  }
}
export default EventStore;
