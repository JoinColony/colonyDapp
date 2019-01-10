/* @flow */

import { KVStore } from '../../../lib/database/stores';
import { colonyMeta } from './meta';

import type { StoreBlueprint } from '~types';

const draftsIndexStoreBlueprint: StoreBlueprint = {
  // TODO add access controller
  meta: colonyMeta,
  name: 'draftsIndex',
  type: KVStore,
};

export default draftsIndexStoreBlueprint;
