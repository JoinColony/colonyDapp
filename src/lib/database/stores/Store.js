/* @flow */
/* eslint-disable no-underscore-dangle */

import type { ObjectSchema } from 'yup';

import type { OrbitDBStore } from '../types/index';

/**
 * A parent class for a wrapper around an orbit store that can hold its schema
 * and perform certain validations based on the store type.
 */
class Store {
  +_orbitStore: OrbitDBStore;

  _schema: ObjectSchema;

  _schemaId: string;

  constructor(
    orbitStore: OrbitDBStore,
    schemaId: string,
    schema: ObjectSchema,
  ) {
    this._orbitStore = orbitStore;
    this._schemaId = schemaId;
    this._schema = schema;
  }

  get address() {
    return this._orbitStore.address;
  }

  load() {
    return this._orbitStore.load();
  }
}

export default Store;
