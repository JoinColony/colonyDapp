/* @flow */

import type { OrbitDBStore, Schema } from './types';

/**
 * A parent claass for a wrapper around an orbit store that can hold it's schema
 * and can do certain validations based on the store type
 */
class Store {
  +_orbitStore: OrbitDBStore;

  _schema: Schema;

  _schemaId: string;

  constructor(orbitStore: OrbitDBStore, schemaId: string, schema: Schema) {
    this._orbitStore = orbitStore;
    this._schemaId = schemaId;
    this._schema = schema;
  }

  get address() {
    return this._orbitStore.address;
  }
}

export default Store;
