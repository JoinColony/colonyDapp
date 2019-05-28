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
   * Given a callback for handling events, and optional options,
   * create a subscription that calls the callback with all
   * unique events, and provide a means to stop the subscription.
   */
  subscribe(
    callback: (event: Event<*>) => void,
    {
      filter,
      takeExisting,
    }: {| filter?: (event: Event<*>) => boolean, takeExisting?: boolean |} = {},
  ): {| stop: () => void |} {
    const hashes = new Set();

    const handleEntry = (entry: Entry) => {
      // To avoid duplicate entries, ignore the entry if its hash was
      // encountered before.
      if (hashes.has(entry.hash)) return;
      hashes.add(entry.hash);

      const event = this.constructor.decorateEntry(entry);

      if (!filter || filter(event)) callback(event);
    };

    const onReplicateProgress = (address: string, hash: string, entry: Entry) =>
      handleEntry(entry);
    const onWrite = debounce(
      (address: string, entry: Entry) => handleEntry(entry),
      1000,
    );

    this._orbitStore.events.on('replicate.progress', onReplicateProgress);
    this._orbitStore.events.on('write', onWrite);

    if (takeExisting) {
      this._orbitStore
        .iterator({ limit: -1 })
        .collect()
        .forEach(handleEntry);
    }

    return {
      // The consumer is expected to stop the event listeners.
      stop: () => {
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
