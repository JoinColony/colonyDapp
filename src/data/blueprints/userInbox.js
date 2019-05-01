/* @flow */

import type { Address, StoreBlueprint } from '~types';

import { EventStore } from '~lib/database/stores';
import { PermissiveAccessController } from '../accessControllers';
import { storePropsResolver } from './resolvers';

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
  deterministicAddress: true,
  resolver: storePropsResolver,
});

export default userInboxStoreBlueprint;
