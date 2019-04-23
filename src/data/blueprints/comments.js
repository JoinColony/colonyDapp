/* @flow */

import type { Address, StoreBlueprint } from '~types';
import type { TaskDraftId } from '~immutable';

import { EventStore } from '../../lib/database/stores';
import { getPermissiveStoreAccessController } from '../accessControllers';

const commentsStore: StoreBlueprint = {
  getAccessController: getPermissiveStoreAccessController,
  getName: ({
    colonyAddress,
    draftId,
  }: {
    colonyAddress: Address,
    draftId: TaskDraftId,
  } = {}) => {
    if (!(colonyAddress && draftId)) {
      throw new Error('Could not generate task comments store name');
    }
    return `colony_${colonyAddress}_task_${draftId}_comments`;
  },
  type: EventStore,
};

export default commentsStore;
