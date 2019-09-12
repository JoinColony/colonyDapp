/* eslint-disable no-underscore-dangle */

import localStorage from 'localforage';

import { OrbitDBStore } from '../types';
import PinnerConnector from '../../ipfs/PinnerConnector';
import Store from './Store';

import { AllEvents, Entry, EventIteratorOptions } from '~types/index';

/**
 * The wrapper Store class for orbit's eventlog store.
 */
class EventStore extends Store {
  static orbitType = 'eventlog';

  static transformEntry({
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

  _cache: AllEvents[] | void;

  constructor(orbitStore: OrbitDBStore, name: string, pinner: PinnerConnector) {
    super(orbitStore, name, pinner);
    this._orbitStore.events.on('ready', () => {
      this._cache = undefined;
      this.setLSCache().catch(console.error);
    });
    this._orbitStore.events.on('write', () => {
      this.setLSCache().catch(console.error);
    });
    this._orbitStore.events.on('replicated', () => {
      this.setLSCache().catch(console.error);
    });
  }

  async getLSCache(): Promise<AllEvents[] | void> {
    try {
      await localStorage.ready();
    } catch (e) {
      console.warn(
        `Could not initialize local storage. If we're not in a browser, that's fine.`,
        e,
      );
      return undefined;
    }
    return localStorage.getItem(`colony.orbitCache.${this.address.toString()}`);
  }

  async setLSCache() {
    try {
      await localStorage.ready();
    } catch (e) {
      console.warn(
        `Could not initialize local storage. If we're not in a browser, that's fine.`,
        e,
      );
      return undefined;
    }
    return localStorage.setItem(
      `colony.orbitCache.${this.address.toString()}`,
      this.all(),
    );
  }

  async loadEntries() {
    if (!this._ready && !this._cache) {
      this._cache = await this.getLSCache();
      if (!this._cache) {
        await super.loadEntries();
        return;
      }
    }
    super.loadEntries().catch(console.error);
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
    return this._orbitStore.add(value);
  }

  getEvent(hash: string) {
    return EventStore.transformEntry(this._orbitStore.get(hash));
  }

  get(hashOrOptions: string | EventIteratorOptions) {
    return typeof hashOrOptions === 'string'
      ? this.getEvent(hashOrOptions)
      : this.all(hashOrOptions);
  }

  all(options: EventIteratorOptions = { limit: -1 }) {
    if (!this._ready && this._cache) {
      return this._cache;
    }

    return this._orbitStore
      .iterator(options)
      .collect()
      .map(entry => EventStore.transformEntry(entry));
  }

  // Get the result of `EventStore.all()` when any entry is added
  subscribe(callback: (events: AllEvents[]) => void): { stop: () => void } {
    const allEvents = () => callback(this.all());

    this._orbitStore.events.on('ready', allEvents);
    this._orbitStore.events.on('replicated', allEvents);
    this._orbitStore.events.on('write', allEvents);

    // Emit all events when the subscription starts
    allEvents();

    return {
      // The consumer is expected to stop the event listeners.
      stop: () => {
        this._orbitStore.events.removeListener('ready', allEvents);
        this._orbitStore.events.removeListener('replicated', allEvents);
        this._orbitStore.events.removeListener('write', allEvents);
      },
    };
  }
}

export default EventStore;
