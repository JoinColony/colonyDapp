/* @flow */

import type { ObjectSchema, ValidateOptions } from 'yup';

import PinnerConnector from '../../ipfs/PinnerConnector';
import Store from './Store';

import type { OrbitDBDocStore, OrbitDBStore } from '../types/index';

/*
 * Wraps an Orbit docstore to store just one document (with a static key).
 */
class SingleDocStore extends Store {
  static orbitType = 'docstore';

  // The only ID used for the Orbit docstore
  static id = '0';

  // https://github.com/babel/babel/issues/8417#issuecomment-415508558
  +_orbitStore: OrbitDBDocStore = this._orbitStore;

  _schema: ObjectSchema;

  constructor(
    orbitStore: OrbitDBStore,
    name: string,
    pinner: PinnerConnector,
    schema: ObjectSchema,
  ) {
    super(orbitStore, name, pinner);
    this._schema = schema;
  }

  get() {
    return this._orbitStore.get(this.constructor.id)[0];
  }

  async validate(value: {}, options?: ValidateOptions = { strict: true }) {
    return this._schema.validate(value, options);
  }

  async update(value: {}) {
    const existing = this.get();
    if (!existing) throw new Error('Cannot update; document not found');

    return this._update(existing, value);
  }

  async upsert(value: {}) {
    const existing = this.get() || {};
    return this._update(existing, value);
  }

  async _update(existing: {}, value: {}) {
    const merged = { ...existing, ...value, _id: this.constructor.id };
    const validated = await this.validate(merged);
    return this._orbitStore.put(validated);
  }
}

export default SingleDocStore;
