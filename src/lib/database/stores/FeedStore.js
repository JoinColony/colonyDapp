/* @flow */

import type { ValidateOptions } from 'yup';

import type { FeedIteratorOptions, OrbitDBFeedStore } from '../types/index';
import Store from './Store';

/**
 * The wrapper Store class for orbit's feed stores.
 * Includes schema validation
 */
class FeedStore extends Store {
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

  all(options: FeedIteratorOptions = {}) {
    return this._orbitStore
      .iterator({ ...options, limit: -1 })
      .collect()
      .map(item => item.payload.value);
  }
}
export default FeedStore;
