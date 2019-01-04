/* @flow */

import type { ObjectSchema, ValidateOptions } from 'yup';

import PinnerConnector from '../../ipfs/PinnerConnector';
import Store from './Store';

import type {
  OrbitDBDocStore,
  OrbitDBStore,
  QueryFunction,
} from '../types/index';

/**
 * The wrapper Store class for orbit's document stores.
 */
class DocStore extends Store {
  static orbitType = 'docstore';

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

  async validate(value: {}, options?: ValidateOptions = { strict: true }) {
    return this._schema.validate(value, options);
  }

  async upsertOne(id: string, value: {}) {
    const existing = this.getOne(id) || {};
    const merged = { ...existing, ...value, _id: id };
    const validated = await this.validate(merged);
    // TODO consider guarding against unnecessary updates by comparing values?
    return this._orbitStore.put(validated);
  }

  async insertOne(value: { id?: string }) {
    const id = value.id || this.constructor.generateId();
    return this.upsertOne(id, value);
  }

  async updateOne(id: string, value: {}) {
    const existing = this.getOne(id);
    if (!existing) throw new Error(`"${id}" not found`);

    return this.upsertOne(id, value);
  }

  async removeOne(id: string) {
    return this._orbitStore.del(id);
  }

  getOne(keyOrFunction: string | QueryFunction) {
    return typeof keyOrFunction === 'string'
      ? this._orbitStore.get(keyOrFunction)[0]
      : this.getMany(keyOrFunction)[0];
  }

  getMany(queryFunction: QueryFunction) {
    return this._orbitStore.query(queryFunction);
  }

  getAll() {
    return this.getMany(e => e);
  }
}

export default DocStore;
