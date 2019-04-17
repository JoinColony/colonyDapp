/* @flow */

import type { OrbitDBStore } from './OrbitDBStore';
import type { Entry } from './Entry';

// NOTE reverse option appears to have no effect
export type FeedIteratorOptions = {
  gt?: string,
  gte?: string,
  lt?: string,
  lte?: string,
  limit?: number,
  reverse?: boolean,
};

export interface OrbitDBFeedStore extends OrbitDBStore {
  add(value: any): Promise<string>;
  remove(key: string): Promise<string>;
  get(key: string): Entry;
  iterator(options?: FeedIteratorOptions): { collect: () => Entry[] };
}
