/* @flow */

import type { Address, StoreBlueprint } from '~types';
import type { TaskDraftId } from '~immutable';

import { EventStore } from '../../lib/database/stores';
import { getTaskStoreAccessController } from '../accessControllers';

/**
 * @todo : We should type store props!
 */
const taskStoreBlueprint: StoreBlueprint = Object.freeze({
  getAccessController: getTaskStoreAccessController,
  getName: ({
    colonyAddress,
    draftId,
  }: {
    colonyAddress: Address,
    draftId: TaskDraftId,
  } = {}) => {
    if (!(colonyAddress && draftId))
      throw new Error('Could not generate task store name');
    return `colony_${colonyAddress}_task_${draftId}`;
  },
  type: EventStore,
});

export default taskStoreBlueprint;
