/* @flow */

import type { OrbitDBStore } from './OrbitDBStore';

export type QueryFunction = ({}) => any;

export interface OrbitDBDocStore extends OrbitDBStore {
  put(key: string, value: any): Promise<string>;
  del(key: string): Promise<string>;
  get(key: string): [Object];
  query(mapper: QueryFunction): Object[];
}
