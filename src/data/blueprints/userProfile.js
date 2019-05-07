/* @flow */

import type { StoreBlueprint } from '~types';

import { EventStore } from '../../lib/database/stores';
import { getEthereumWalletStoreAccessController } from '../accessControllers';

const userProfileStore: StoreBlueprint = Object.freeze({
  getAccessController: getEthereumWalletStoreAccessController,
  defaultName: 'userProfile',
  type: EventStore,
});

export default userProfileStore;
