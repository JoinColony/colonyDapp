/* @flow */

// This file is in prepartion to handle multiple store types with one command
// and to add more complex functionality

// import { Store } from './Store';
// import { KVStore } from './KVStore';

export const get = (store: Store, key: string): any => {
  if (store.get) {
    return store.get(key);
  }
  return null;
};

export const all = (store: Store): any => {
  if (store.all) {
    return store.all();
  }
  return null;
};
