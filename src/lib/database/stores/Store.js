/* @flow */

import type { OrbitDBStore } from '../types';
import { raceAgainstTimeout } from '../../../utils/async';
import { log } from '../../../utils/debug';
import PinnerConnector from '../../ipfs/PinnerConnector';

// How long should we wait for the next replication message unntil we assume it's done
const REPLICATION_KEEP_ALIVE_TIMEOUT = 3 * 1000;
// How long should we wait for replication in general
const REPLICATION_TIMEOUT = 10 * 1000;
// How often should we check whether a store is replicating
const REPLICATION_CHECK_INTERVAL = 500;
// How long should we wait for a store to load
const LOAD_TIMEOUT = 30 * 1000;

/**
 * A parent class for a wrapper around an orbit store that can load
 * data in the store and pin the store.
 */
class Store {
  static orbitType: string;

  +_orbitStore: OrbitDBStore;

  _name: string;

  _pinner: PinnerConnector;

  _busyPromise: ?Promise<void>;

  _replicationTimeout: TimeoutID | null;

  constructor(orbitStore: OrbitDBStore, name: string, pinner: PinnerConnector) {
    this._orbitStore = orbitStore;
    this._orbitStore.events.on('replicate', () =>
      this._renewReplicationTimeout(REPLICATION_KEEP_ALIVE_TIMEOUT),
    );
    this._orbitStore.events.on('replicate.progress', () =>
      this._renewReplicationTimeout(REPLICATION_KEEP_ALIVE_TIMEOUT),
    );
    this._name = name;
    this._pinner = pinner;
    this._busyPromise = null;
  }

  get address() {
    return this._orbitStore.address;
  }

  get busy() {
    return !!this._busyPromise;
  }

  get length() {
    // eslint-disable-next-line no-underscore-dangle
    return this._orbitStore._oplog.length;
  }

  _renewReplicationTimeout(ms: number) {
    if (this._replicationTimeout) clearTimeout(this._replicationTimeout);
    this._replicationTimeout = setTimeout(() => {
      if (this._replicationTimeout) {
        clearTimeout(this._replicationTimeout);
        this._replicationTimeout = null;
      }
    }, ms);
  }

  async _loadEntries() {
    await this.ready();

    try {
      await this.replicate();
    } catch (caughtError) {
      log.warn(`Could not request pinned store`, caughtError);
    }
  }

  async ready() {
    log.verbose(`Loading store "${this._name}"`);
    const headCountPromise = new Promise(resolve =>
      this._orbitStore.events.once('ready', (dbname, heads) => resolve(heads)),
    );
    const loadPromise = this._orbitStore.load();

    const [heads] = await raceAgainstTimeout(
      Promise.all([headCountPromise, loadPromise]),
      LOAD_TIMEOUT,
      new Error('Could not get store heads in time'),
    );
    return heads;
  }

  async replicate() {
    const address = this.address.toString();
    const headCount = await this._pinner.requestReplication(address);
    log.verbose(
      `Pinner has ${headCount} heads, we have ${
        this.length
      } for store ${address}`,
    );

    if (this.length < headCount) {
      log.verbose(`Replicating store ${address}`);
      // Wait for a store replication to start
      this._renewReplicationTimeout(2 * REPLICATION_KEEP_ALIVE_TIMEOUT);
      let interval;
      await raceAgainstTimeout(
        new Promise(resolve => {
          interval = setInterval(() => {
            if (!this._replicationTimeout) {
              clearInterval(interval);
              resolve();
            }
          }, REPLICATION_CHECK_INTERVAL);
        }),
        REPLICATION_TIMEOUT,
        new Error('Replication timeout (Pinner might still have more heads)'),
        () => clearInterval(interval),
      );
      log.verbose(`Store sucessfully replicated: ${address}`);
    }
  }

  async load() {
    if (this._busyPromise) {
      return this._busyPromise;
    }
    try {
      this._busyPromise = this._loadEntries();
      return this._busyPromise;
    } catch (caughtError) {
      // We just throw the error again. We're just using this to be able to set the busy indicator easily
      throw caughtError;
    } finally {
      this._busyPromise = null;
    }
  }

  /**
   * Removes the local database completely and unpin it
   * @method drop
   * @return {Promise} A Promise that is resolved with the store removal
   */
  async drop() {
    await this.unpin();
    return this._orbitStore.drop();
  }

  // eslint-disable-next-line class-methods-use-this
  async unpin() {
    /**
     * @todo Support store unpinning
     * @body When pinion supports it :)
     */
    return null;
  }
}

export default Store;
