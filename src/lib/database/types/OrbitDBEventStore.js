/* @flow */

import type { OrbitDBStore } from './OrbitDBStore';

// NOTE reverse option appears to have no effect
export type EventIteratorOptions = {
  gt?: string,
  gte?: string,
  lt?: string,
  lte?: string,
  limit?: number,
  reverse?: boolean,
};

export interface OrbitDBEventStore extends OrbitDBStore {
  add(value: any): Promise<string>;
  get(key: string): Object;
  iterator(options?: EventIteratorOptions): { collect: () => Array<Object> };
}
