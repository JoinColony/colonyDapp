/* @flow */

import type { Address, Subscription } from '~types';
import type { TaskDraftId } from '~immutable';

import type { ColonyManager, DDB, Query, Wallet, TaskStore } from '~data/types';
import type { TaskEvents } from '~data/types/TaskEvents';

import { CONTEXT } from '~context';

import { getTaskStore, getTaskStoreAddress } from '~data/stores';
import { taskReducer } from '../reducers';

type TaskStoreMetadata = {| colonyAddress: Address, draftId: TaskDraftId |};

const initialTask = {
  amountPaid: undefined,
  // $MeFixFlow
  commentsStoreAddress: '',
  createdAt: undefined,
  creatorAddress: undefined,
  description: undefined,
  domainId: undefined,
  // $MeFixFlow
  draftId: '',
  dueDate: undefined,
  finalizedAt: undefined,
  invites: [],
  paymentId: undefined,
  payout: undefined,
  paymentTokenAddress: undefined,
  requests: [],
  skillId: undefined,
  status: undefined,
  title: undefined,
  workerAddress: undefined,
};

const prepareTaskStoreQuery = async (
  {
    colonyManager,
    ddb,
    wallet,
  }: {|
    colonyManager: ColonyManager,
    ddb: DDB,
    wallet: Wallet,
  |},
  metadata: TaskStoreMetadata,
) => {
  const { colonyAddress } = metadata;
  const colonyClient = await colonyManager.getColonyClient(colonyAddress);
  const taskStoreAddress = await getTaskStoreAddress(colonyClient, ddb, wallet)(
    metadata,
  );

  /*
   * @todo StoreLocator: Getters should return a store **ONLY** by address
   * @body Store getters should return a store **ONLY** by address. We need a StoreLocator
   * with resolvers that can infer the address for deterministic address stores so the dapp can get that address easily
   * That should by #964
   */
  return getTaskStore(colonyClient, ddb, wallet)({
    ...metadata,
    taskStoreAddress,
  });
};

/**
 * @todo Merge contract events into getTask query.
 */
// eslint-disable-next-line import/prefer-default-export
export const getTask: Query<TaskStore, TaskStoreMetadata, void, *> = {
  name: 'getTask',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreQuery,
  async execute(taskStore) {
    return taskStore.all().reduce(taskReducer, initialTask);
  },
};

export const subscribeTask: Subscription<
  TaskStore,
  TaskStoreMetadata,
  void,
  TaskEvents[],
> = {
  name: 'subscribeTask',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreQuery,
  execute(taskStore, args, emitter) {
    return [taskStore.subscribe(emitter)];
  },
};
