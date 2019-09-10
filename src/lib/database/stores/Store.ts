import { OrbitDBStore } from '../types';
import { raceAgainstTimeout } from '../../../utils/async';
import { log } from '../../../utils/debug';
import PinnerConnector from '../../ipfs/PinnerConnector';

// How long should we wait for the next replication message unntil we assume it's done
const REPLICATION_KEEP_ALIVE_TIMEOUT = 3 * 1000;
// How often should we check whether a store is replicating
const REPLICATION_CHECK_INTERVAL = 500;
// How long should we wait for a store to load
const LOAD_TIMEOUT = 20 * 1000;
// How long should we wait for a single entry to load
const LOAD_ENTRY_TIMEOUT = 5 * 1000;
// How long we should wait after a write to be considered 'busy'
const WRITE_TIMEOUT = 10 * 1000;

type TimeoutID = any;

/**
 * A parent class for a wrapper around an orbit store that can load
 * data in the store and pin the store.
 */
class Store {
  static orbitType: string;

  private busyPromise: Promise<void> | null;

  readonly orbitStore: OrbitDBStore;

  readonly name: string;

  private readonly pinner: PinnerConnector;

  private isReady = false;

  private replicationTimeout: TimeoutID | null;

  private writeTimeout: TimeoutID | null;

  constructor(orbitStore: OrbitDBStore, name: string, pinner: PinnerConnector) {
    this.orbitStore = orbitStore;
    this.orbitStore.events.on('replicate', () =>
      this.renewReplicationTimeout(REPLICATION_KEEP_ALIVE_TIMEOUT),
    );
    this.orbitStore.events.on('replicate.progress', () =>
      this.renewReplicationTimeout(REPLICATION_KEEP_ALIVE_TIMEOUT),
    );
    // After a write to a store, wait for some time to give replication a chance to be done
    this.orbitStore.events.on('write', () => {
      this.deferReplicate();
      if (this.writeTimeout) clearTimeout(this.writeTimeout);
      this.writeTimeout = setTimeout(() => {
        this.writeTimeout = null;
      }, WRITE_TIMEOUT);
    });
    this.orbitStore.events.once('ready', () => {
      this.isReady = true;
    });
    this.name = name;
    this.pinner = pinner;
    this.busyPromise = null;
  }

  get address() {
    return this.orbitStore.address;
  }

  get busy() {
    return (
      !!this.busyPromise || !!this.replicationTimeout || !!this.writeTimeout
    );
  }

  get length() {
    // eslint-disable-next-line no-underscore-dangle
    return this.orbitStore._oplog.length;
  }

  private renewReplicationTimeout(ms: number) {
    if (this.replicationTimeout) clearTimeout(this.replicationTimeout);
    this.replicationTimeout = setTimeout(() => {
      if (this.replicationTimeout) {
        clearTimeout(this.replicationTimeout);
        this.replicationTimeout = null;
      }
    }, ms);
  }

  async loadEntries() {
    const startLoading = Date.now();
    await this.ready();
    log.verbose(
      `Loaded store "${this.name}" in ${Date.now() - startLoading} ms`,
    );
    try {
      await this.replicate();
    } catch (caughtError) {
      this.pinner.events.emit('error', 'store:load', caughtError);
      log.warn(`Could not request pinned store`, caughtError);
    }
  }

  async ready() {
    log.verbose(`Loading store "${this.name}"`);
    // This *should* be fine. If we loaded the store once we don't need to load it again
    // Replication will do the rest
    // eslint-disable-next-line no-underscore-dangle
    if (this.isReady) return this.orbitStore._oplog.length;
    const headCountPromise = new Promise(resolve =>
      this.orbitStore.events.once('ready', (dbname, heads) => resolve(heads)),
    );
    const loadPromise = this.orbitStore.load(-1, {
      fetchEntryTimeout: LOAD_ENTRY_TIMEOUT,
    });

    try {
      const [heads]: any = await raceAgainstTimeout(
        Promise.all([headCountPromise, loadPromise]),
        LOAD_TIMEOUT,
        new Error('Could not get store heads in time'),
      );
      return heads;
    } catch (caughtError) {
      this.pinner.events.emit('error', 'store:load', caughtError);
      log.warn(caughtError);
      return 0;
    }
  }

  private deferReplicate() {
    // We're probably "just" sending data _to_ the pinner. No need to wait for its response.
    const address = this.address.toString();
    this.pinner.requestReplication(address).catch(log.warn);
  }

  private async replicate() {
    const address = this.address.toString();
    this.pinner
      .requestReplication(address)
      .then(headCount => {
        log.verbose(
          // eslint-disable-next-line max-len
          `Pinner has ${headCount} heads, we have ${this.length} for store ${address}`,
        );
      })
      .catch(log.warn);

    log.verbose(`Replicating store ${address}`);
    // Wait for a store replication to start
    this.renewReplicationTimeout(REPLICATION_KEEP_ALIVE_TIMEOUT);
    await new Promise(resolve => {
      const interval = setInterval(() => {
        if (!this.replicationTimeout) {
          clearInterval(interval);
          log.verbose(`Store sucessfully replicated: ${address}`);
          resolve();
        }
      }, REPLICATION_CHECK_INTERVAL);
    });
  }

  async load() {
    if (this.busyPromise) {
      return this.busyPromise;
    }
    try {
      this.busyPromise = this.loadEntries();
      return this.busyPromise;
    } finally {
      this.busyPromise = null;
    }
  }

  /**
   * Removes the local database completely and unpin it
   * @method drop
   * @return {Promise} A Promise that is resolved with the store removal
   */
  async drop() {
    await this.unpin();
    return this.orbitStore.drop();
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
