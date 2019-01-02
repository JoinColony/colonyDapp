/* @flow */

import { Store, KVStore, ValidatedKVStore } from './stores';

// This file is in preparation to handle multiple store types with one command
// and to add more complex functionality

export const get = (store: Store | KVStore, key: string) =>
  typeof store.get === 'function' ? store.get(key) : null;

export const getAll = (store: Store | ValidatedKVStore) =>
  typeof store.all === 'function' ? store.all() : null;
