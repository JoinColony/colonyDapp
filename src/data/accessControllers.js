/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';
import type { Address } from '~types';

import {
  PermissiveAccessController,
  EthereumWalletAccessController,
  ColonyAccessController,
} from '../lib/database/accessControllers';

import loadPermissionManifest from '../lib/database/accessControllers/permissions';

export const getPermissiveStoreAccessController = (): PermissiveAccessController =>
  new PermissiveAccessController();

export const getEthereumWalletStoreAccessController = ({
  walletAddress,
}: {
  walletAddress: Address,
} = {}): EthereumWalletAccessController => {
  if (!walletAddress)
    throw new Error(
      // eslint-disable-next-line max-len
      `Could not create access controller, invalid wallet address: "${walletAddress}"`,
    );
  return new EthereumWalletAccessController(walletAddress);
};

export const getAttributesBasedStoreAccessController = ({
  colonyAddress,
  colonyClient,
  wallet,
}: {
  colonyAddress: Address,
  wallet: WalletObjectType,
  colonyClient: ColonyClientType,
} = {}): ColonyAccessController => {
  if (!colonyAddress)
    throw new Error(
      // eslint-disable-next-line max-len
      `Could not create access controller, invalid colony address: "${colonyAddress}"`,
    );
  if (!wallet)
    throw new Error(
      'Could not create access controller, a wallet object is required',
    );
  if (!colonyClient)
    throw new Error(
      'Could not create access controller, colony client is required',
    );

  const manifest = loadPermissionManifest(colonyClient);
  return new ColonyAccessController(colonyAddress, wallet, manifest);
};
