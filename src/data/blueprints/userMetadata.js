/* @flow */

import type { Address, StoreBlueprint } from '~types';

import { EventStore } from '~lib/database/stores';
import { EthereumWalletAccessController } from '../accessControllers';

export type UserMetadataStoreProps = {|
  chainId: string,
  walletAddress: Address,
|};

const getEthereumWalletStoreAccessController = ({
  walletAddress,
}: UserMetadataStoreProps) => {
  if (!walletAddress)
    throw new Error(
      // eslint-disable-next-line max-len
      `Could not create access controller, invalid wallet address: "${walletAddress}"`,
    );
  return new EthereumWalletAccessController(walletAddress);
};

export type UserMetadataStoreBlueprint = StoreBlueprint<
  UserMetadataStoreProps,
  EthereumWalletAccessController,
>;

const userMetadataStoreBlueprint: UserMetadataStoreBlueprint = Object.freeze({
  getAccessController: getEthereumWalletStoreAccessController,
  getName: ({ chainId, walletAddress }) =>
    `network.${chainId}.userMetadata.${walletAddress}`,
  type: EventStore,
});

export default userMetadataStoreBlueprint;
