/* @flow */

import { EventStore } from '../../lib/database/stores';
import { getColonyStoreAccessController } from '../accessControllers';

import type { StoreBlueprint } from '~types';

const colonyStoreBlueprint: StoreBlueprint = Object.freeze({
  getAccessController: getColonyStoreAccessController,
  defaultName: 'colony',
  type: EventStore,
});

export default colonyStoreBlueprint;
