import { Address, StoreBlueprint } from '~types/index';

import { EventStore } from '~lib/database/stores';
import { PermissiveAccessController } from '../accessControllers/index';

export type UserInboxStoreProps = {
  chainId: string;
  walletAddress: Address;
};

export type UserInboxStoreBlueprint = StoreBlueprint<
  UserInboxStoreProps,
  PermissiveAccessController
>;

const userInboxStoreBlueprint: UserInboxStoreBlueprint = Object.freeze({
  getAccessController: () => new PermissiveAccessController(),
  getName: ({ chainId, walletAddress }) =>
    `network.${chainId}.userInbox.${walletAddress}`,
  type: EventStore,
});

export default userInboxStoreBlueprint;
