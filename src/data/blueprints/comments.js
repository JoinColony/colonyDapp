/* @flow */

import type { StoreBlueprint } from '~types/index';

import { EventStore } from '../../lib/database/stores';
import { getPermissiveStoreAccessController } from '../accessControllers';

const commentsStore: StoreBlueprint = {
  getAccessController: getPermissiveStoreAccessController,
  name: 'comments',
  type: EventStore,
};

export default commentsStore;
