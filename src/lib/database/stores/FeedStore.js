/* @flow */

import type { ValidateOptions, ObjectSchema } from 'yup';

import PinnerConnector from '../../ipfs/PinnerConnector';
import Store from './Store';

import type {
  FeedIteratorOptions,
  OrbitDBFeedStore,
  OrbitDBStore,
} from '../types';

/**
 * The wrapper Store class for orbit's feed stores.
 * Includes function to return all values, and schema validation.
 */
class FeedStore extends Store {
  static orbitType = 'feed';

  // https://github.com/babel/babel/issues/8417#issuecomment-415508558
  +_orbitStore: OrbitDBFeedStore = this._orbitStore;

  _schema: ObjectSchema;

  constructor(
    orbitStore: OrbitDBStore,
    name: string,
    pinner: PinnerConnector,
    schema?: ObjectSchema,
  ) {
    if (!schema) throw new Error('A schema is required for FeedStores');
    super(orbitStore, name, pinner);
    this._schema = schema;
  }

  async validate(value?: any, options?: ValidateOptions = { strict: true }) {
    return this._schema.validate(value, options);
  }

  async query(filter: * = {}) {
    return this._orbitStore
      .iterator(filter)
      .collect()
      .reduce(
        (events, event) => [
          ...events,
          ...((event &&
            event.next &&
            event.next.length &&
            event.next.map(hash => this._orbitStore.get(hash))) ||
            []),
          event,
        ],
        [],
      )
      .map(event => event.payload.value);
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
}
export default FeedStore;
