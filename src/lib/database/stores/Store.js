/* @flow */

import type { OrbitDBStore } from '../types';

import { raceAgainstTimeout } from '../../../utils/async';
import { log } from '../../../utils/debug';
import PinnerConnector from '../../ipfs/PinnerConnector';

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

  constructor(
    orbitStore: OrbitDBStore,
    name: string,
    pinner: PinnerConnector,
    ...args: * // eslint-disable-line no-unused-vars
  ) {
    this._orbitStore = orbitStore;
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

  async _loadHeads() {
    const address = this.address.toString();
    // Let's see whether we have local heads already
    const heads = await this.ready();

    if (heads && heads.length) {
      log.verbose(`we have heads for store ${address}`);
      // We have *some* heads and just assume it's going to be ok. We request the pinned store anyways
      // but don't have to wait for any count. We'll replicate whenever it's convenient
      // We're calling this synchronously as we don't care about the result
      // _right now_
      /**
       * @todo Improve error modes for failed pinned store requests
       * @body This could be dangerous in case of an unfinished replication. We have to account for that Quick fix could be to just also wait for the full replication, which might be a performance hit
       */
      this._pinner
        .ready()
        .then(() => this._pinner.requestPinnedStore(address))
        .catch(log.warn);
      return;
    }

    try {
      // Try to connect to pinner, wait if necessary
      await this._pinner.ready();
    } catch (caughtError) {
      log.error(
        `Unable to fully load store "${this._name}"; pinner is offline`,
        caughtError,
      );
      // Pinner is probably offline
      log(caughtError);
    }
    try {
      log.verbose(`Sending request for store ${address}`);
      await Promise.all([
        this._waitForReplication(),
        this._pinner.requestPinnedStore(address),
      ]);
      return;
    } catch (caughtError) {
      log.warn(`Could not request pinned store: ${caughtError}`);
    }
  }

  async _waitForReplication() {
    const replicated = new Promise(resolve => {
      const listener = (peer: string) => {
        if (this._pinner.isPinner(peer)) {
          resolve();
          this._orbitStore.events.removeListener('peer.exchanged', listener);
        }
      };
      this._orbitStore.events.addListener('peer.exchanged', listener);
    });
    return raceAgainstTimeout(
      replicated,
      60 * 1000,
      new Error('Could not replicate with pinner in time.'),
    );
  }

  async ready() {
    log.verbose(`Loading store "${this._name}"`);
    const headCountPromise = new Promise(resolve =>
      this._orbitStore.events.once('ready', (dbname, heads) => resolve(heads)),
    );
    const loadPromise = this._orbitStore.load();

    const [heads] = await raceAgainstTimeout(
      Promise.all([headCountPromise, loadPromise]),
      10000,
      new Error('Could not get store heads in time'),
    );
    return heads;
  }

  async load() {
    if (this._busyPromise) {
      return this._busyPromise;
    }
    try {
      this._busyPromise = this._loadHeads();
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

  async pin() {
    return this._pinner.pinStore(this.address.toString());
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
