/* @flow */

import type { ObjectSchema, ValidateOptions, Schema } from 'yup';

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

  static metaId = 'meta';

  // https://github.com/babel/babel/issues/8417#issuecomment-415508558
  +_orbitStore: OrbitDBDocStore = this._orbitStore;

  _docSchema: Schema;

  _metaSchema: Schema;

  constructor(
    orbitStore: OrbitDBStore,
    name: string,
    pinner: PinnerConnector,
    schema: ObjectSchema,
  ) {
    super(orbitStore, name, pinner);

    const { doc, meta } = schema.fields;
    this._docSchema = doc;
    this._metaSchema = meta;
  }

  async validate(value: {}, options?: ValidateOptions = { strict: true }) {
    return this._docSchema.validate(value, options);
  }

  async upsertOne(id: string, value: {}) {
    const existing = this.getOne(id) || {};
    const merged = { ...existing, ...value };
    const validated = await this.validate(merged);
    return this._orbitStore.put({ _id: id, ...validated });
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

  async setMeta(meta: {}) {
    // Guard against overwriting
    if (this.getMeta()) return Promise.resolve();

    const validated = this._metaSchema.validate(meta, { strict: true });
    return this.upsertOne(this.constructor.metaId, validated);
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

  getMeta() {
    return this.getOne(this.constructor.metaId);
  }
}

export default DocStore;
