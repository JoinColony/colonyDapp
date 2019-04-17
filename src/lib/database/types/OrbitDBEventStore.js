/* @flow */

import type { OrbitDBStore } from './OrbitDBStore';
import type { Entry } from './Entry';

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
  get(key: string): Entry;
  iterator(options?: EventIteratorOptions): { collect: () => Entry[] };
}
