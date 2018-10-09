/* @flow */

import type { OrbitDBStore } from './OrbitDBStore';

export interface OrbitDBKVStore extends OrbitDBStore {
  put(key: any, value: any): Promise<void>;
  set(key: any, value: any): Promise<void>;

  get(key: any): any;
}
