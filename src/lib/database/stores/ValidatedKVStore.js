/* @flow */

import type { ObjectSchema, ValidateOptions } from 'yup';

import KVStore from './KVStore';
import PinnerConnector from '../../ipfs/PinnerConnector';

import type { OrbitDBKVStore } from '../types';

/**
 * The wrapper Store class for orbit's key-value stores. Includes functions to
 * set and get entire objects and schema validation
 *
 * T: Type for the keys/values stored
 */
class ValidatedKVStore<T: { [key: string]: * }> extends KVStore {
  _schema: ObjectSchema;

  constructor(
    orbitStore: OrbitDBKVStore,
    name: string,
    pinner: PinnerConnector,
    schema?: ObjectSchema,
  ) {
    if (!schema) throw new Error('A schema is required for ValidatedKVStores');
    super(orbitStore, name, pinner);
    this._schema = schema;
  }

  async validate(
    keyOrObject: $Keys<T> | $Shape<T>,
    value?: any,
    options?: ValidateOptions = { strict: true },
  ) {
    if (typeof keyOrObject === 'string') {
      const schema = this._schema.fields[keyOrObject];
      if (!schema) throw new Error(`Key "${keyOrObject}" not found on schema`);
      return schema.validate(value, options);
    }

    return this._schema.validate(keyOrObject, options);
  }

  async set(keyOrObject: $Keys<T> | $Shape<T>, value?: any) {
    const validated = await this.validate(keyOrObject, value);
    return typeof keyOrObject === 'string'
      ? super.set(keyOrObject, validated)
      : super.set(validated);
  }

  async append(key: string & $Keys<T>, value?: any) {
    const validated = await this.validate(key, [value]);
    return super.append(validated);
  }

  all(): $Shape<T> {
    return Object.keys(this._schema.fields).reduce((data, key) => {
      const value = this._orbitStore.get(key);
      // We could `.cast()` the values from the schema instead of removing
      // undefined values, but that could potentially throw errors.
      if (typeof value !== 'undefined') {
        // eslint-disable-next-line no-param-reassign
        data[key] = value;
      }
      return data;
    }, {});
  }

  get<K: string>(key: K & $Keys<T>): ?$ElementType<T, K> {
    return super.get(key);
  }
}

export default ValidatedKVStore;
