/* @flow */

import type { Address, StoreBlueprint } from '~types';

import { EventStore } from '~lib/database/stores';
import { PermissiveAccessController } from '../accessControllers';

export type UserInboxStoreProps = {|
  walletAddress: Address,
|};

export type UserInboxStoreBlueprint = StoreBlueprint<
  UserInboxStoreProps,
  PermissiveAccessController,
>;

const userInboxStoreBlueprint: UserInboxStoreBlueprint = Object.freeze({
  getAccessController: () => new PermissiveAccessController(),
  getName: ({ walletAddress }) => `userInbox.${walletAddress}`,
  type: EventStore,
});

export default userInboxStoreBlueprint;
