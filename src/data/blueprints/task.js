/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';
import type { Address, StoreBlueprint } from '~types';
import type { TaskDraftId } from '~immutable';

import { EventStore } from '~lib/database/stores';
import { TaskAccessController } from '../accessControllers';
import loadPermissionManifest from '../permissions';

export type TaskStoreProps = {|
  colonyAddress: Address,
  chainId: string,
  draftId: TaskDraftId,
  wallet: WalletObjectType,
  colonyClient: ColonyClientType,
|};

export const getTaskStoreAccessController = ({
  draftId,
  colonyAddress,
  colonyClient,
  wallet,
}: TaskStoreProps) => {
  if (!draftId)
    throw new Error(
      `Could not create access controller, invalid draft ID: "${draftId}"`,
    );
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
  return new TaskAccessController(draftId, colonyAddress, wallet, manifest);
};

export type TaskStoreBlueprint = StoreBlueprint<
  TaskStoreProps,
  TaskAccessController,
>;

const taskStoreBlueprint: TaskStoreBlueprint = Object.freeze({
  getAccessController: getTaskStoreAccessController,
  getName: ({ chainId, colonyAddress, draftId }) =>
    `network.${chainId}.colony.${colonyAddress}.task.${draftId}`,
  type: EventStore,
});

export default taskStoreBlueprint;
