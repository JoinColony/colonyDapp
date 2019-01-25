/* @flow */

import { EventStore } from '../../lib/database/stores';
import { getAttributesBasedStoreAccessController } from '../accessControllers';

import type { StoreBlueprint } from '~types';

const taskStoreBlueprint: StoreBlueprint = {
  getAccessController: getAttributesBasedStoreAccessController,
  name: 'task',
  type: EventStore,
};

export default taskStoreBlueprint;
