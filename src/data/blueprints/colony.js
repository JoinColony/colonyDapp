/* @flow */

import { EventStore } from '../../lib/database/stores';
import { getAttributesBasedStoreAccessController } from '../accessControllers';

import type { StoreBlueprint } from '~types';

const colonyStoreBlueprint: StoreBlueprint = {
  getAccessController: getAttributesBasedStoreAccessController,
  name: 'colony',
  type: EventStore,
};

export default colonyStoreBlueprint;
