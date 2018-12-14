/* @flow */

import type { OrbitDBStore } from './OrbitDBStore';

export interface OrbitDBDocStore extends OrbitDBStore {
  put(value: any): Promise<string>;
  del(key: string): Promise<string>;
  get(key: string): Array<Object>;
  query(mapper: Function): Array<Object>;
}
