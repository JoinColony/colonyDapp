/* @flow */

import { KVStore } from '../../../lib/database/stores';
import { colonyMeta } from './meta';

import type { StoreBlueprint } from '~types';

const tasksIndexStoreBlueprint: StoreBlueprint = {
  // TODO add access controller
  meta: colonyMeta,
  name: 'tasksIndex',
  type: KVStore,
};

export default tasksIndexStoreBlueprint;
