/* @flow */

import type { ValidateOptions } from 'yup';

import type { OrbitDBKVStore } from '../types/index';
import Store from './Store';

/**
 * The wrapper Store class for orbit's key-value stores. Includes functions to
 * set and get entire objects and schema validation
 */
class KVStore extends Store {
  static orbitType = 'keyvalue';

  // https://github.com/babel/babel/issues/8417#issuecomment-415508558
  +_orbitStore: OrbitDBKVStore = this._orbitStore;

  async validate(
    keyOrObject: string | {},
    value?: any,
    options?: ValidateOptions = { strict: true },
  ) {
    if (typeof keyOrObject === 'string') {
      const schema = this._schema.fields[keyOrObject];
      if (!schema) throw new Error(`Key "${keyOrObject}" not found on schema`);
      return { [keyOrObject]: await schema.validate(value, options) };
    }

    return this._schema.validate(keyOrObject, options);
  }

  async set(keyOrObject: string | {}, value?: any) {
    const validated = await this.validate(keyOrObject, value);
    return this._setObject(validated);
  }

  async update(key: string, nestedKey: string, value: any) {
    const validated = await this.validate(key);
    const existing = this._orbitStore.get(key) || {};
    return this._orbitStore.put(key, { ...existing, nestedKey: value });
  }

  async append(key: string, value?: any) {
    const validated = await this.validate(key, [value]);
    const existing = this._orbitStore.get(key) || [];
    return this._orbitStore.put(key, existing.concat(validated));
  }

  get(key: string) {
    return this._orbitStore.get(key);
  }

  all() {
    return Object.keys(this._schema.fields).reduce((data, key) => {
      const value = this._orbitStore.get(key);
      // XXX We could `.cast()` the values from the schema instead of removing
      // undefined values, but that could potentially throw errors.
      if (typeof value !== 'undefined') {
        // eslint-disable-next-line no-param-reassign
        data[key] = value;
      }
      return data;
    }, {});
  }

  async _setObject(obj: {}) {
    // Creating a promise chain to sequentially work through the entries
    return Object.entries(obj).reduce((promise, [key, value]) => {
      const next = () => this._orbitStore.put(key, value);
      return promise.then(next);
    }, Promise.resolve(true));
  }
}

export default KVStore;
