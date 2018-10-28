/* @flow */

// This file is in prepartion to handle multiple store types with one command
// and to add more complex functionality

export const get = (store: Store, key: string): any => {
  if (store.get) {
    return store.get(key);
  }
  return null;
};

export const getAll = (store: Store): any => {
  if (store.all) {
    return store.all();
  }
  return null;
};
