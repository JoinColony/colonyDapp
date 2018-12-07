/* @flow */
/* eslint-disable no-underscore-dangle */

import type { ObjectSchema } from 'yup';

import type { OrbitDBStore } from '../types/index';

/**
 * A parent class for a wrapper around an orbit store that can hold its schema
 * and perform certain validations based on the store type.
 */
class Store {
  static orbitType: string;

  +_orbitStore: OrbitDBStore;

  _schema: ObjectSchema;

  _name: string;

  constructor(orbitStore: OrbitDBStore, name: string, schema: ObjectSchema) {
    this._orbitStore = orbitStore;
    this._name = name;
    this._schema = schema;
  }

  get address() {
    return this._orbitStore.address;
  }

  /*
    NOTE: `load` is an async function, so this function returns a promise.
   */
  load() {
    return this._orbitStore.load();
  }
}

export default Store;
