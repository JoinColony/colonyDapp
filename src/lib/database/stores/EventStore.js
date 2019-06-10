/* @flow */

import debounce from 'lodash/debounce';

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
      .map(entry => this.constructor.decorateEntry(entry));
  }

  /*
   * Given a callback for handling events, and optional options,
   * create a subscription that calls the callback with all
   * unique events, and provide a means to stop the subscription.
   */
  subscribe(
    callback: (event: Event<*>) => void,
    { filter }: {| filter?: (event: Event<*>) => boolean |} = {},
  ): {| stop: () => void |} {
    // This naïve state is used over Orbit querying (e.g. with `gt`) because
    // events earlier than the local heads may come in with `replicated` events
    const taken = new Set<$PropertyType<Entry, 'hash'>>();

    const takeEntry = (entry: Entry) => {
      taken.add(entry.hash);
      const event = this.constructor.decorateEntry(entry);
      if (!filter || filter(event)) {
        callback(event);
      }
    };

    const takeEntries = () =>
      this._orbitStore
        .iterator({ limit: -1 })
        .collect()
        .filter(({ hash }) => !taken.has(hash))
        .forEach(takeEntry);

    const onReplicated = debounce(takeEntries, 1000);
    const onWrite = (address: string, entry: Entry) =>
      taken.has(entry.hash) || takeEntry(entry);

    this._orbitStore.events.on('replicated', onReplicated);
    this._orbitStore.events.on('write', onWrite);

    // Take all entries when the sub starts; this has the same effect as
    // receiving the first `replicated` event (but that might not
    // happen immediately).
    takeEntries();

    return {
      // The consumer is expected to stop the event listeners.
      stop: () => {
        this._orbitStore.events.removeListener('replicated', onReplicated);
        this._orbitStore.events.removeListener('write', onWrite);
      },
    };
  }
}

export default EventStore;
