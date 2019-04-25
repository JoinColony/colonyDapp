/* @flow */

import Store from './Store';

import type { EventIteratorOptions, OrbitDBEventStore, Entry } from '../types';

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
        (entries, entry) => [
          ...entries,
          ...((entry &&
            entry.next &&
            entry.next.length &&
            entry.next.map(hash => this._orbitStore.get(hash))) ||
            []),
          entry,
        ],
        [],
      )
      .map(entry => this.constructor.decorateEntry(entry));
  }

  async append(value: {}) {
    return this._orbitStore.add(value);
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
      .map(entry => this.constructor.decorateEntry(entry));
  }
}
export default EventStore;
