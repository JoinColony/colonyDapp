/* @flow */

import type { OrbitDBStore } from '../types';
import { raceAgainstTimeout } from '../../../utils/async';
import { log } from '../../../utils/debug';
import PinnerConnector from '../../ipfs/PinnerConnector';

// How long should we wait for the next replication message unntil we assume it's done
const REPLICATION_KEEP_ALIVE_TIMEOUT = 3 * 1000;
// How often should we check whether a store is replicating
const REPLICATION_CHECK_INTERVAL = 500;
// How long should we wait for a store to load
const LOAD_TIMEOUT = 20 * 1000;
// How long we should wait after a write to be considered 'busy'
const WRITE_TIMEOUT = 10 * 1000;

/**
 * A parent class for a wrapper around an orbit store that can load
 * data in the store and pin the store.
 */
class Store {
  static orbitType: string;

  _busyPromise: ?Promise<void>;

  +_orbitStore: OrbitDBStore;

  _name: string;

  _pinner: PinnerConnector;

  _ready: boolean = false;

  _replicationTimeout: TimeoutID | null;

  _writeTimeout: TimeoutID | null;

  constructor(orbitStore: OrbitDBStore, name: string, pinner: PinnerConnector) {
    this._orbitStore = orbitStore;
    this._orbitStore.events.on('replicate', () =>
      this._renewReplicationTimeout(REPLICATION_KEEP_ALIVE_TIMEOUT),
    );
    this._orbitStore.events.on('replicate.progress', () =>
      this._renewReplicationTimeout(REPLICATION_KEEP_ALIVE_TIMEOUT),
    );
    // After a write to a store, wait for some time to give replication a chance to be done
    this._orbitStore.events.on('write', () => {
      this.deferReplicate();
      if (this._writeTimeout) clearTimeout(this._writeTimeout);
      this._writeTimeout = setTimeout(() => {
        this._writeTimeout = null;
      }, WRITE_TIMEOUT);
    });
    this._orbitStore.events.once('ready', () => {
      this._ready = true;
    });
    this._name = name;
    this._pinner = pinner;
    this._busyPromise = null;
  }

  get address() {
    return this._orbitStore.address;
  }

  get busy() {
    return (
      !!this._busyPromise || !!this._replicationTimeout || !!this._writeTimeout
    );
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

  async loadEntries() {
    const startLoading = Date.now();
    await this.ready();
    log.verbose(
      `Loaded store "${this._name}" in ${Date.now() - startLoading} ms`,
    );
    try {
      await this.replicate();
    } catch (caughtError) {
      log.warn(`Could not request pinned store`, caughtError);
    }
  }

  async ready() {
    log.verbose(`Loading store "${this._name}"`);
    // This *should* be fine. If we loaded the store once we don't need to load it again
    // Replication will do the rest
    // eslint-disable-next-line no-underscore-dangle
    if (this._ready) return this._orbitStore._oplog.length;
    const headCountPromise = new Promise(resolve =>
      this._orbitStore.events.once('ready', (dbname, heads) => resolve(heads)),
    );
    const loadPromise = this._orbitStore.load(-1, {
      fetchEntryTimeout: LOAD_TIMEOUT,
    });

    const [heads] = await raceAgainstTimeout(
      Promise.all([headCountPromise, loadPromise]),
      LOAD_TIMEOUT,
      new Error('Could not get store heads in time'),
    );
    return heads;
  }

  deferReplicate() {
    // We're probably "just" sending data _to_ the pinner. No need to wait for its response.
    const address = this.address.toString();
    this._pinner.requestReplication(address).catch(log.warn);
  }

  async replicate() {
    const address = this.address.toString();
    this._pinner
      .requestReplication(address)
      .then(headCount => {
        log.verbose(
          `Pinner has ${headCount} heads, we have ${
            this.length
          } for store ${address}`,
        );
      })
      .catch(log.warn);

    log.verbose(`Replicating store ${address}`);
    // Wait for a store replication to start
    this._renewReplicationTimeout(REPLICATION_KEEP_ALIVE_TIMEOUT);
    await new Promise(resolve => {
      const interval = setInterval(() => {
        if (!this._replicationTimeout) {
          clearInterval(interval);
          log.verbose(`Store sucessfully replicated: ${address}`);
          resolve();
        }
      }, REPLICATION_CHECK_INTERVAL);
    });
  }

  async load() {
    if (this._busyPromise) {
      return this._busyPromise;
    }
    try {
      this._busyPromise = this.loadEntries();
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
