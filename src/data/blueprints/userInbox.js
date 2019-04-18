/* @flow */

import type { StoreBlueprint } from '~types/index';

import { EventStore } from '../../lib/database/stores';
import { getPermissiveStoreAccessController } from '../accessControllers';

const userInboxStore: StoreBlueprint = {
  getAccessController: getPermissiveStoreAccessController,
  name: 'userInbox',
  type: EventStore,
};

export default userInboxStore;
