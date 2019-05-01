/* @flow */

import type { Address, StoreBlueprint } from '~types';

import { EventStore } from '../../lib/database/stores';
import { EthereumWalletAccessController } from '../accessControllers';
import { createENSResolver } from './resolvers';

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

const resolver = createENSResolver<{ walletAddress: Address }>();
const userProfileStoreBlueprint: UserProfileStoreBlueprint = Object.freeze({
  getAccessController: getEthereumWalletStoreAccessController,
  getName: ({ walletAddress }) => `userProfile.${walletAddress}`,
  type: EventStore,
  resolver,
});

export default userProfileStoreBlueprint;
