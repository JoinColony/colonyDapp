/* @flow */

import type { Address, StoreBlueprint } from '~types';
import type { TaskDraftId } from '~immutable';

import { EventStore } from '~lib/database/stores';
import { PermissiveAccessController } from '../accessControllers';
import { storePropsResolver } from './resolvers';

export type CommentsStoreProps = {|
  colonyAddress: Address,
  draftId: TaskDraftId,
|};

export type CommentsStoreBlueprint = StoreBlueprint<
  CommentsStoreProps,
  PermissiveAccessController,
>;

const commentsStoreBlueprint: CommentsStoreBlueprint = Object.freeze({
  getAccessController: () => new PermissiveAccessController(),
  getName: ({ colonyAddress, draftId }) => {
    if (!(colonyAddress && draftId)) {
      throw new Error('Could not generate task comments store name');
    }
    return `colony.${colonyAddress}.task.${draftId}.comments`;
  },
  type: EventStore,
  deterministicAddress: true,
  resolver: storePropsResolver,
});

export default commentsStoreBlueprint;
