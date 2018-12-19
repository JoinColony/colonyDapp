/* @flow */

import generate from 'nanoid/generate';
import urlDictionary from 'nanoid/url';
import type { ValidateOptions } from 'yup';

import type { OrbitDBDocStore, QueryFunction } from '../types/index';
import Store from './Store';

const generateId = () => generate(urlDictionary, 21);

/**
 * The wrapper Store class for orbit's document stores.
 */
class DocStore extends Store {
  static orbitType = 'docstore';

  // https://github.com/babel/babel/issues/8417#issuecomment-415508558
  +_orbitStore: OrbitDBDocStore = this._orbitStore;

  async validate(value: {}, options?: ValidateOptions = { strict: true }) {
    return this._schema.validate(value, options);
  }

  async add(value: { id?: string }) {
    const validated = await this.validate(value);
    const id = value.id ? value.id : generateId();
    return this._orbitStore.put({ _id: id, ...validated });
  }

  // TODO async addMany() {}

  async update(key: string, value: {}) {
    const existing = this.get(key);
    if (Array.isArray(existing))
      throw new Error('Please pass a string as the key');
    const updated = { ...existing, ...value };
    const validated = await this.validate(updated);
    return this._orbitStore.put(validated);
  }

  get(keyOrFunction: string | QueryFunction) {
    return typeof keyOrFunction === 'string'
      ? this._orbitStore.get(keyOrFunction)[0]
      : this._orbitStore.query(keyOrFunction);
  }

  remove(key: string) {
    return this._orbitStore.del(key);
  }

  all() {
    return this.get(e => e);
  }
}

export default DocStore;
