/* @flow */

import type { OrbitDBKVStore, Schema } from './types';
import Store from './Store';

/**
 * The wrapper Store class for orbit's key-value stores. Includes functions to
 * set and get entire objects and schema validation
 */
class KVStore extends Store {
  // https://github.com/babel/babel/issues/8417#issuecomment-415508558
  +_orbitStore: OrbitDBKVStore = this._orbitStore;

  constructor(orbitStore: OrbitDBKVStore, schemaId: string, schema: Schema) {
    super(orbitStore, schemaId, schema);
    this._orbitStore.put('created', new Date().toUTCString());
  }

  address(): string {
    return this._orbitStore.address;
  }

  async set(keyOrObject: string | {}, value?: any): Promise<any> {
    // TODO: schema validation. Obviously
    if (typeof keyOrObject == 'string') {
      return this._orbitStore.put(keyOrObject, value);
    }
    const schemaProps = Object.keys(this._schema);
    const actions = Object.keys(keyOrObject)
      .map(prop => {
        if (schemaProps.includes(prop)) {
          return this._orbitStore.put(prop, keyOrObject[prop]);
        }
        return null;
      })
      .filter(Boolean);
    return Promise.all(actions);
  }

  get(key: string): any {
    return this._orbitStore.get(key);
  }

  all(): any {
    return Object.keys(this._schema).reduce((data, key) => {
      const val = this._orbitStore.get(key);
      if (val) {
        // eslint-disable-next-line no-param-reassign
        data[key] = val;
      }
      return data;
    }, {});
  }

  // TODO: Do we need an append method for arrays? Probably
}

export default KVStore;
