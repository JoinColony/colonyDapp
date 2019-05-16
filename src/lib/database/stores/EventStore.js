/* @flow */

import Store from './Store';

import type { EventIteratorOptions, OrbitDBEventStore, Entry } from '~types';

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
   * Wrap the store iterator such that the entries are decorated.
   */
  iterator(options: EventIteratorOptions = { limit: -1 }) {
    const iter = this._orbitStore.iterator(options);
    return {
      collect: iter.collect,
      next: () => {
        const { done, value } = iter.next();
        return {
          done,
          value: value ? this.constructor.decorateEntry(value) : null,
        };
      },
    };
  }

  onReplicated(handler: (logsLength: number) => void) {
    const wrappedHandler = (address: string, logsLength: number) =>
      handler(logsLength);
    this._orbitStore.events.on('replicated', wrappedHandler);
    return {
      close: () => {
        this._orbitStore.events.removeListener('replicated', wrappedHandler);
      },
      handler: wrappedHandler,
    };
  }

  onWrite(handler: (address: string, entry: *, remoteHeads: *) => void) {
    const wrappedHandler = (address: string, entry: Entry) =>
      handler(address, this.constructor.decorateEntry(entry));
    this._orbitStore.events.on('write', wrappedHandler);
    return {
      close: () => {
        this._orbitStore.events.removeListener('write', wrappedHandler);
      },
      handler: wrappedHandler,
    };
  }
}

export default EventStore;
