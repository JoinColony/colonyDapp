/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';
import type { Address, StoreBlueprint } from '~types';

import { EventStore } from '~lib/database/stores';
import { ColonyAccessController } from '../accessControllers';
import loadPermissionManifest from '../permissions';

export type ColonyStoreProps = {|
  colonyAddress: Address,
  chainId: string,
  wallet: WalletObjectType,
  colonyClient: ColonyClientType,
|};

export const getColonyStoreAccessController = ({
  colonyAddress,
  colonyClient,
  wallet,
}: ColonyStoreProps) => {
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

export type ColonyStoreBlueprint = StoreBlueprint<
  ColonyStoreProps,
  ColonyAccessController,
>;

const colonyStoreBlueprint: ColonyStoreBlueprint = Object.freeze({
  getAccessController: getColonyStoreAccessController,
  getName: ({ colonyAddress, chainId }) =>
    `network.${chainId}.colony.${colonyAddress}`,
  type: EventStore,
});

export default colonyStoreBlueprint;
