import { EventStore } from '~lib/database/stores';
import { Address, StoreBlueprint } from '~types/index';
import { PermissiveAccessController } from '../accessControllers/index';

export type CommentsStoreProps = {
  colonyAddress: Address;
  chainId: string;
  draftId: string;
};

export type CommentsStoreBlueprint = StoreBlueprint<
  CommentsStoreProps,
  PermissiveAccessController
>;

const commentsStoreBlueprint: CommentsStoreBlueprint = Object.freeze({
  getAccessController: () => new PermissiveAccessController(),
  getName: ({ chainId, colonyAddress, draftId }) =>
    `network.${chainId}.colony.${colonyAddress}.task.${draftId}.comments`,
  type: EventStore,
});

export default commentsStoreBlueprint;
