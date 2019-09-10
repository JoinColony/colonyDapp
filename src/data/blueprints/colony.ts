import { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import { WalletObjectType } from '@colony/purser-core';
import { Address, StoreBlueprint } from '~types/index';

import { EventStore } from '~lib/database/stores';
import { ColonyAccessController } from '../accessControllers/index';
import loadPermissionManifest, { MANIFEST_LOADERS } from '../permissions/index';

export interface ColonyStoreProps {
  colonyAddress: Address;
  chainId: string;
  wallet: WalletObjectType;
  colonyClient: ColonyClientType;
}

export const getColonyStoreAccessController = ({
  colonyAddress,
  colonyClient,
  wallet,
}: ColonyStoreProps) => {
  if (!colonyAddress)
    throw new Error( // eslint-disable-next-line max-len
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

  const manifest = loadPermissionManifest(colonyClient, [
    MANIFEST_LOADERS.COMMON,
    MANIFEST_LOADERS.COLONY,
  ]);
  return new ColonyAccessController(colonyAddress, wallet, manifest);
};

export type ColonyStoreBlueprint = StoreBlueprint<
  ColonyStoreProps,
  ColonyAccessController
>;

const colonyStoreBlueprint: ColonyStoreBlueprint = Object.freeze({
  getAccessController: getColonyStoreAccessController,
  getName: ({ colonyAddress, chainId }) =>
    `network.${chainId}.colony.${colonyAddress}`,
  type: EventStore,
});

export default colonyStoreBlueprint;
