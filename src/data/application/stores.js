/* @flow */

import type { DDB } from '../../lib/database';
import type { StoreBlueprint } from '~types';

export const createStore = (ddb: DDB) => async (
  blueprint: StoreBlueprint,
  storeProps: Object,
) => ddb.createStore(blueprint, storeProps);

export const getStore = (ddb: DDB) => async (
  blueprint: StoreBlueprint,
  storeIdentifier: string,
  storeProps: Object,
) => ddb.getStore(blueprint, storeIdentifier, storeProps);
