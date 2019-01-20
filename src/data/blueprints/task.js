/* @flow */

import { EventStore } from '../../lib/database/stores';
// import { colonyMeta } from './meta';

import type { StoreBlueprint } from '~types';

const taskStoreBlueprint: StoreBlueprint = {
  // TODO add access controller
  name: 'task',
  type: EventStore,
};

export default taskStoreBlueprint;
