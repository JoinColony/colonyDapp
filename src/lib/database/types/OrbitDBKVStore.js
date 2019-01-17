/* @flow */

import type { OrbitDBStore } from './OrbitDBStore';

export interface OrbitDBKVStore extends OrbitDBStore {
  put(key: string, value: any): Promise<void>;
  set(key: string, value: any): Promise<void>;
  all(): Object;
  get(key: string): any;
}
