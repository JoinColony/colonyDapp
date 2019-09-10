import localStorage from 'localforage';

import { AllCurrentEvents, Event, EventIteratorOptions } from '~types/index';
import { transformEntry } from '~data/utils';
import { OrbitDBStore } from '../types';
import PinnerConnector from '../../ipfs/PinnerConnector';
import Store from './Store';

/**
 * The wrapper Store class for orbit's eventlog store.
 */
class EventStore extends Store {
  static orbitType = 'eventlog';

  private cache: AllCurrentEvents[] | void;

  constructor(orbitStore: OrbitDBStore, name: string, pinner: PinnerConnector) {
    super(orbitStore, name, pinner);
    this.orbitStore.events.on('ready', () => {
      this.cache = undefined;
      this.setLSCache().catch(console.error);
    });
    this.orbitStore.events.on('write', () => {
      this.setLSCache().catch(console.error);
    });
    this.orbitStore.events.on('replicated', () => {
      this.setLSCache().catch(console.error);
    });
  }

  private async getLSCache(): Promise<AllCurrentEvents[] | void> {
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

  private async setLSCache() {
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
    if (!this.ready && !this.cache) {
      this.cache = await this.getLSCache();
      if (!this.cache) {
        await super.loadEntries();
        return;
      }
    }
    super.loadEntries().catch(console.error);
  }

  async append(event: Event<any>) {
    return this.orbitStore.add(event);
  }

  getEvent(hash: string) {
    return transformEntry(this.orbitStore.get(hash));
  }

  get(hashOrOptions: string | EventIteratorOptions) {
    return typeof hashOrOptions == 'string'
      ? this.getEvent(hashOrOptions)
      : this.all(hashOrOptions);
  }

  all(options: EventIteratorOptions = { limit: -1 }): AllCurrentEvents[] {
    if (!this.ready && this.cache) {
      return this.cache;
    }

    return this.orbitStore
      .iterator(options)
      .collect()
      .map(transformEntry);
  }

  // Get the result of `EventStore.all()` when any entry is added
  subscribe(
    callback: (events: AllCurrentEvents[]) => void,
  ): { stop: () => void } {
    const allEvents = () => callback(this.all());

    this.orbitStore.events.on('ready', allEvents);
    this.orbitStore.events.on('replicated', allEvents);
    this.orbitStore.events.on('write', allEvents);

    // Emit all events when the subscription starts
    allEvents();

    return {
      // The consumer is expected to stop the event listeners.
      stop: () => {
        this.orbitStore.events.removeListener('ready', allEvents);
        this.orbitStore.events.removeListener('replicated', allEvents);
        this.orbitStore.events.removeListener('write', allEvents);
      },
    };
  }
}

export default EventStore;
