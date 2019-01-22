/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';

import type { Address, StoreBlueprint } from '~types';

import { EventStore } from '../../lib/database/stores';
import { ColonyAccessController } from '../../lib/database/accessControllers';
import loadPermissionManifest from '../../lib/database/accessControllers/permissions';

const taskStoreBlueprint: StoreBlueprint = {
  getAccessController({
    colonyAddress,
    colonyClient,
    wallet,
  }: {
    colonyAddress: Address,
    wallet: WalletObjectType,
    colonyClient: ColonyClientType,
  }) {
    const manifest = loadPermissionManifest(colonyClient);
    return new ColonyAccessController(colonyAddress, wallet, manifest);
  },
  name: 'task',
  type: EventStore,
};

export default taskStoreBlueprint;
