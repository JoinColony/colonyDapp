/* @flow */

import type { ObjectSchema, ValidateOptions } from 'yup';

import type {
  FeedIteratorOptions,
  OrbitDBFeedStore,
  OrbitDBStore,
} from '../types/index';
import Store from './Store';

/**
 * The wrapper Store class for orbit's feed stores.
 * Includes schema validation
 */
class FeedStore extends Store {
  +_orbitStore: OrbitDBFeedStore = this._orbitStore;

  constructor(
    orbitStore: OrbitDBStore,
    schemaId: string,
    schema: ObjectSchema,
  ) {
    super(orbitStore, schemaId, schema);
    this._orbitStore.add({
      userAction: 'Joined Colony 🎉🎉',
      createdAt: new Date().toUTCString(),
      colonyName: '',
    });
  }

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
      : this._orbitStore.iterator(hashOrOptions).collect();
  }

  all() {
    return this._orbitStore.iterator().collect();
  }
}
export default FeedStore;
