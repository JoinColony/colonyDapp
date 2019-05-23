/* @flow */

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

  /*
   @NOTE: for initialization purposes. The convention we're creating is that
   from within "infrastructure" layer we can only initialize. "service" layer
   can really append and fetch data
   */
  async init(value: {}) {
    return this.append(value);
  }

  /*
   * This is currently unused; do we still need it?
   */
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

  /*
   * Given a callback for handling events, create a subscription
   * that calls the callback with all unique events, and provide
   * a means to close the subscription.
   */
  subscribe(callback: (event: Event<*>) => void): {| close: () => void |} {
    const hashes = [];

    /*
     * Given an entry from the store, call the callback when
     * the entry hash has not been handled previously, so as to avoid
     * duplicate entries.
     */
    const handleEntry = (entry: Entry) => {
      if (!hashes.includes(entry.hash)) {
        hashes.push(entry.hash);
        callback(this.constructor.decorateEntry(entry));
      }
    };

    /*
     * Define and start the event listeners in order to handle new entries.
     */
    const onReplicateProgress = (address: string, hash: string, entry: Entry) =>
      handleEntry(entry);
    const onWrite = (address: string, entry: Entry) => handleEntry(entry);
    this._orbitStore.events.on('replicate.progress', onReplicateProgress);
    this._orbitStore.events.on('write', onWrite);

    /*
     * Handle all existing entries.
     */
    this._orbitStore
      .iterator({ limit: -1 })
      .collect()
      .forEach(handleEntry);

    return {
      /*
       * Provide a means of removing the event listeners.
       */
      close: () => {
        this._orbitStore.events.removeListener(
          'replicate.progress',
          onReplicateProgress,
        );
        this._orbitStore.events.removeListener('write', onWrite);
      },
    };
  }
}

export default EventStore;
