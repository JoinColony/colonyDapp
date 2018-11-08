/* @flow */

import type { OrbitDBStore } from './OrbitDBStore';

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
  get(key: string): Object;
  iterator(options?: FeedIteratorOptions): { collect: () => Array<Object> };
}
