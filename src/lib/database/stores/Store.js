/* @flow */

import type { ObjectSchema } from 'yup';

import { raceAgainstTimeout } from '../../../utils/async';

import type { OrbitDBStore } from '../types';

import PinnerConnector from '../../ipfs/PinnerConnector';

/**
 * A parent class for a wrapper around an orbit store that can hold its schema
 * and perform certain validations based on the store type.
 */
class Store {
  static orbitType: string;

  +_orbitStore: OrbitDBStore;

  _name: string;

  _schema: ObjectSchema;

  _pinner: PinnerConnector;

  constructor(
    orbitStore: OrbitDBStore,
    name: string,
    schema: ObjectSchema,
    pinner: PinnerConnector,
  ) {
    this._orbitStore = orbitStore;
    this._name = name;
    this._pinner = pinner;
    this._schema = schema;
  }

  get address() {
    return this._orbitStore.address;
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
    // Let's see whether we have local heads already
    const heads = await this.ready();

    if (!heads || !heads.length) {
      // We don't have local heads. Let's ask the pinner
      const { count } = await this._pinner.requestPinnedStore(
        this.address.toString(),
      );
      if (count) {
        return this._waitForReplication(count);
        // We're replicated and done
      }
      // Pinner doesn't have any heads either. Maybe it's a newly created store?
      throw new Error('Could not load store heads from anywhere');
    }
    // We have *some* heads and just assume it's going to be ok. We request the pinned store anyways
    // but don't have to wait for any count. We'll replicate whenever it's convenient
    // TODO: This could be dangerous in case of an unfinished replication. We have to account for that
    // Quick fix could be to just also wait for the full replication, which might be a performance hit
    this._pinner.requestPinnedStore(this.address.toString());
    return heads;
  }

  pin() {
    this._pinner.pinStore(this.address.toString());
  }
}

export default Store;
