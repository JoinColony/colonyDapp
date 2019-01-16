/* @flow */

import promiseSeries from 'p-series';

import { log } from '../../../utils/debug';

import type { OrbitDBKVStore } from '../types';

import Store from './Store';

/**
 * The wrapper Store class for orbit's key-value stores. Includes functions to
 * set and get entire objects
 */
class KVStore extends Store {
  static orbitType = 'keyvalue';

  // https://github.com/babel/babel/issues/8417#issuecomment-415508558
  +_orbitStore: OrbitDBKVStore = this._orbitStore;

  async set(keyOrObject: string | {}, value?: any) {
    this.pin().catch(log);
    return typeof keyOrObject === 'string'
      ? this._orbitStore.put(keyOrObject, value)
      : this._setObject(keyOrObject);
  }

  async append(key: string, value?: any) {
    const existing = this._orbitStore.get(key) || [];
    return this._orbitStore.put(key, existing.concat(value));
  }

  get(key: string) {
    return this._orbitStore.get(key);
  }

  async _setObject(obj: {}) {
    return promiseSeries(
      Object.entries(obj).map(([key, value]) => () =>
        this._orbitStore.put(key, value),
      ),
    );
  }
}

export default KVStore;
