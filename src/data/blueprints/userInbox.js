/* @flow */

import type { StoreBlueprint } from '~types/index';

import { EventStore } from '../../lib/database/stores';
import { getPermissiveStoreAccessController } from '../accessControllers';

const userInboxStore: StoreBlueprint = Object.freeze({
  getAccessController: getPermissiveStoreAccessController,
  defaultName: 'userInbox',
  type: EventStore,
});

export default userInboxStore;
