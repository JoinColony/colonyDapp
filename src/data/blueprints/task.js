/* @flow */

import { EventStore } from '../../lib/database/stores';
import { getTaskStoreAccessController } from '../accessControllers';

import type { StoreBlueprint } from '~types';

const taskStoreBlueprint: StoreBlueprint = {
  getAccessController: getTaskStoreAccessController,
  name: 'task',
  type: EventStore,
};

export default taskStoreBlueprint;
