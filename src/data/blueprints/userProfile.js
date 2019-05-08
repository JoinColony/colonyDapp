/* @flow */

import type { Address, StoreBlueprint } from '~types';

import { EventStore } from '../../lib/database/stores';
import { EthereumWalletAccessController } from '../accessControllers';

export type UserProfileStoreProps = {|
  walletAddress: Address,
|};

export type UserProfileStoreBlueprint = StoreBlueprint<
  UserProfileStoreProps,
  EthereumWalletAccessController,
>;

const getEthereumWalletStoreAccessController = ({
  walletAddress,
}: UserProfileStoreProps) => {
  if (!walletAddress)
    throw new Error(
      // eslint-disable-next-line max-len
      `Could not create access controller, invalid wallet address: "${walletAddress}"`,
    );
  return new EthereumWalletAccessController(walletAddress);
};

const userProfileStoreBlueprint: UserProfileStoreBlueprint = Object.freeze({
  getAccessController: getEthereumWalletStoreAccessController,
  getName: ({ walletAddress }) => `userProfile.${walletAddress}`,
  type: EventStore,
});

export default userProfileStoreBlueprint;
