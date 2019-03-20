/* @flow */

import generate from 'nanoid/generate';
import urlDictionary from 'nanoid/url';

import { raceAgainstTimeout } from '../../../utils/async';
import { log } from '../../../utils/debug';

import type { OrbitDBStore } from '../types';

import PinnerConnector from '../../ipfs/PinnerConnector';

/**
 * A parent class for a wrapper around an orbit store that can load
 * data in the store and pin the store.
 */
class Store {
  static orbitType: string;

  static generateId() {
    return generate(urlDictionary, 21);
  }

  +_orbitStore: OrbitDBStore;

  _name: string;

  _pinner: PinnerConnector;

  _busyPromise: ?Promise<Array<*>>;

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
    // Let's see whether we have local heads already
    const heads = await this.ready();

    // TODO consider throwing an error when we are relying fully on the pinner.
    if (!this._pinner.online) {
      log(new Error('Unable to load store; pinner is offline'));
      return heads;
    }

    if (!(heads && heads.length)) {
      // We don't have local heads. Let's ask the pinner
      const { count } = await this._pinner.requestPinnedStore(
        this.address.toString(),
      );
      if (count) {
        // We're replicated and done
        await this._waitForReplication(count);
        return heads;
      }
      // Pinner doesn't have any heads either. Maybe it's a newly created store?
      throw new Error('Could not load store heads from anywhere');
    }
    // We have *some* heads and just assume it's going to be ok. We request the pinned store anyways
    // but don't have to wait for any count. We'll replicate whenever it's convenient
    // TODO: This could be dangerous in case of an unfinished replication. We have to account for that
    // Quick fix could be to just also wait for the full replication, which might be a performance hit
    this._pinner.requestPinnedStore(this.address.toString()).catch(log);
    return heads;
  }

  async _waitForReplication(headsRequired: number) {
    // TODO: retry, replicated.progress? something else?
    const replicated = new Promise(resolve => {
      const listener = () => {
        // We're using a private API here, don't know whether that's going to be painful at some point
        // eslint-disable-next-line no-underscore-dangle
        if (this._orbitStore._oplog._length >= headsRequired) {
          resolve(true);
          this._orbitStore.events.removeListener('replicated', listener);
        }
      };
      this._orbitStore.events.on('replicated', listener);
    });
    return raceAgainstTimeout(
      replicated,
      10000,
      new Error('Replication did not yield enough heads'),
    );
  }

  async ready() {
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
    if (this._busyPromise) return this._busyPromise;
    try {
      this._busyPromise = this._loadHeads();
      return this._busyPromise;
    } catch (err) {
      // We just throw the error again. We're just using this to be able to set the busy indicator easily
      throw err;
    } finally {
      this._busyPromise = null;
    }
  }

  async pin() {
    return this._pinner.pinStore(this.address.toString());
  }

  // eslint-disable-next-line class-methods-use-this
  async unpin() {
    // TODO use the pinner to stop pinning this store (once it's supported).
    return null;
  }
}

export default Store;
