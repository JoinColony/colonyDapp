/* @flow */

import type { Map as ImmutableMap } from 'immutable';

import type { DataRecord } from './Data';

export type DataMap<K: *, R: *> = ImmutableMap<K, DataRecord<R>>;
