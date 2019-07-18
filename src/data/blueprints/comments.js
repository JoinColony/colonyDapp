/* @flow */

import type { Address, StoreBlueprint } from '~types';
import type { TaskDraftId } from '~immutable';

import { EventStore } from '~lib/database/stores';
import { PermissiveAccessController } from '../accessControllers';

export type CommentsStoreProps = {|
  colonyAddress: Address,
  chainId: string,
  draftId: TaskDraftId,
|};

export type CommentsStoreBlueprint = StoreBlueprint<
  CommentsStoreProps,
  PermissiveAccessController,
>;

const commentsStoreBlueprint: CommentsStoreBlueprint = Object.freeze({
  getAccessController: () => new PermissiveAccessController(),
  getName: ({ chainId, colonyAddress, draftId }) =>
    `network.${chainId}.colony.${colonyAddress}.task.${draftId}.comments`,
  type: EventStore,
});

export default commentsStoreBlueprint;
