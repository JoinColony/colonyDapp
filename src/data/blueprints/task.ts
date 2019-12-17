import { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import { WalletObjectType } from '@colony/purser-core';
import { AnyTask } from '~data/index';
import { Address, StoreBlueprint } from '~types/index';
import { EventStore } from '~lib/database/stores';

import { TaskAccessController } from '../accessControllers/index';
import loadPermissionManifest, { MANIFEST_LOADERS } from '../permissions/index';

interface TaskStoreProps {
  colonyAddress: Address;
  chainId: string;
  draftId: AnyTask['id'];
  domainId: number;
  wallet: WalletObjectType;
  colonyClient: ColonyClientType;
}

const getTaskStoreAccessController = ({
  draftId,
  domainId,
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
    MANIFEST_LOADERS.TASK,
  ]);
  return new TaskAccessController(
    draftId,
    colonyAddress,
    domainId,
    wallet,
    manifest,
  );
};

type TaskStoreBlueprint = StoreBlueprint<TaskStoreProps, TaskAccessController>;

const taskStoreBlueprint: TaskStoreBlueprint = Object.freeze({
  getAccessController: getTaskStoreAccessController,
  getName: ({ chainId, colonyAddress, draftId }) =>
    `network.${chainId}.colony.${colonyAddress}.task.${draftId}`,
  type: EventStore,
});

export default taskStoreBlueprint;
