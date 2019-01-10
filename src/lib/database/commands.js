/* @flow */

import {
  Store,
  DocStore,
  KVStore,
  FeedStore,
  ValidatedKVStore,
} from './stores';

// This file is in preparation to handle multiple store types with one command
// and to add more complex functionality

export const get = (store: Store | KVStore, key: string) =>
  typeof store.get === 'function' ? store.get(key) : null;

export const getAll = (store: Store | ValidatedKVStore) =>
  typeof store.all === 'function' ? store.all() : null;

export const set = async (
  store: Store | DocStore | KVStore | ValidatedKVStore | FeedStore,
  keyOrObject: string | Object,
  value?: any,
) => {
  if (typeof store.set === 'function') return store.set(keyOrObject, value);
  if (
    typeof store.upsertOne === 'function' &&
    typeof keyOrObject === 'string' &&
    typeof value !== 'undefined'
  )
    return store.upsertOne(keyOrObject, value);
  return null;
};

export const setMeta = async (store: Store | DocStore, meta: Object) =>
  typeof store.setMeta === 'function' ? store.setMeta(meta) : null;

export const getMeta = (store: Store | DocStore) =>
  typeof store.getMeta === 'function' ? store.getMeta() : null;

export const remove = async (
  store: Store | DocStore | KVStore | ValidatedKVStore | FeedStore,
  key: string,
) => {
  if (typeof store.remove === 'function') return store.remove(key);
  if (typeof store.removeOne === 'function') return store.removeOne(key);
  return null;
};
