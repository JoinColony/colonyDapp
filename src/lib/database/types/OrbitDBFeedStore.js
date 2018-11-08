/* @flow */

import type { OrbitDBStore } from './OrbitDBStore';

export interface OrbitDBFeedStore extends OrbitDBStore {
    add(value: any): Promise<string>;
    remove(key: string): Promise<string>;
    get(key: string): Object;
    iterator(options: Object): Array<Object>;
}
