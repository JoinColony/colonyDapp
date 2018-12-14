/* @flow */

import type { ValidateOptions } from 'yup';

import type { FeedIteratorOptions, OrbitDBFeedStore } from '../types/index';
import Store from './Store';

/**
 * The wrapper Store class for orbit's feed stores.
 * Includes function to return all values, and schema validation.
 */
class FeedStore extends Store {
  static orbitType = 'feed';

  +_orbitStore: OrbitDBFeedStore = this._orbitStore;

  async validate(value?: any, options?: ValidateOptions = { strict: true }) {
    return this._schema.validate(value, options);
  }

  async add(value: {}) {
    const validated = await this.validate(value);
    return this._orbitStore.add(validated);
  }

  get(hashOrOptions: string | FeedIteratorOptions) {
    return typeof hashOrOptions === 'string'
      ? this._orbitStore.get(hashOrOptions)
      : this.all(hashOrOptions);
  }

  all(options: FeedIteratorOptions = { limit: -1 }) {
    return this._orbitStore
      .iterator(options)
      .collect()
      .map(item => item.payload.value);
  }

  remove(key: string) {
    return this._orbitStore.remove(key);
  }

  async load() {
    const readyPromise = new Promise(resolve => {
      this._orbitStore.events.once('ready', resolve);
    });
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            `Timeout while waiting on replication for store "${this._name}"`,
          ),
        );
      }, 15 * 1000); // 15 seconds
    });

    await super.load();

    return Promise.race([readyPromise, timeoutPromise]);
  }
}
export default FeedStore;
