/* @flow */

import type { OrbitDBStore } from '../types';
import { raceAgainstTimeout } from '../../../utils/async';
import { log } from '../../../utils/debug';
import PinnerConnector from '../../ipfs/PinnerConnector';

const REPLICATION_HACK_INTERVAL = 1000;
const REPLICATION_HACK_TIMEOUT = 60 * 1000;

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

  constructor(orbitStore: OrbitDBStore, name: string, pinner: PinnerConnector) {
    this._orbitStore = orbitStore;
    this._name = name;
    this._pinner = pinner;
    this._busyPromise = null;

    this._orbitStore.events.on('peer.exchanged', (peer, address, heads) => {
      log.verbose(
        `Peer exchanged for store ${this.address.toString()}. Got ${
          heads.length
        } new heads.`,
      );
    });
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

  async _loadHeads() {
    const address = this.address.toString();
    // Let's see whether we have local heads already
    const heads = await this.ready();

    if (heads && heads.length) {
      log.verbose(`we have heads for store ${address}`);
      /**
       * @todo Improve error modes for failed pinned store requests
       * @body We have *some* heads and just assume it's going to be ok. We request the pinned store anyways but don't have to wait for any count. We'll replicate whenever it's convenient. We're calling this synchronously as we don't care about the result _right now_. This could be dangerous in case of an unfinished replication. We have to account for that Quick fix could be to just also wait for the full replication, which might be a performance hit
       */
      this._pinner
        .ready()
        .then(() => this.replicate())
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
    }
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
      10000,
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
    /**
     * @todo Improve replication check
     * @body This is not super accurate as the pinner could have the same number of heads but different ones. This can be improved but checking other internal states (like orbit stores do?). For now it's probably ok. Also, maybe it doesn't really need to be super accurate, as we're replicating anyways.
     */
    // We only block this call if we have 0 heads and the pinner has some
    if (!this.length && headCount) {
      log.verbose(`Waiting for partial replication for store ${address}`);

      /*
       * This is our way of dealing with replication anxiety.
       *
       * If Orbit had a reliable way of determining when a store was replicated
       * (preferably that worked in parallel with other replication requests?)
       * then we would absolutely use that.
       *
       * https://media.giphy.com/media/WQguiWV2XdbDq/giphy.gif
       */
      let interval;
      await raceAgainstTimeout(
        new Promise(resolve => {
          interval = setInterval(() => {
            if (this.length) {
              clearInterval(interval);
              resolve();
            }
          }, REPLICATION_HACK_INTERVAL);
        }),
        REPLICATION_HACK_TIMEOUT,
        new Error('Replication error'),
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
