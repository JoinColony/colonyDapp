import { Address, Subscription } from '~types/index';
import { TaskDraftId } from '~immutable/index';

import { ColonyManager, DDB, Query, Wallet, TaskStore } from '~data/types';
import { TaskEvents } from '~data/types/TaskEvents';

import { Context } from '~context/index';

import { getTaskStore, getTaskStoreAddress } from '~data/stores';
import { taskReducer } from '../reducers';

type TaskStoreMetadata = { colonyAddress: Address; draftId: TaskDraftId };

const initialTask = {
  amountPaid: undefined,
  commentsStoreAddress: '',
  createdAt: undefined,
  creatorAddress: undefined,
  description: undefined,
  domainId: undefined,
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
  }: {
    colonyManager: ColonyManager;
    ddb: DDB;
    wallet: Wallet;
  },
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
export const getTask: Query<TaskStore, TaskStoreMetadata, void, any> = {
  name: 'getTask',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareTaskStoreQuery,
  async execute(taskStore) {
    return taskStore.all().reduce(taskReducer, initialTask);
  },
};

export const subscribeTask: Subscription<
  TaskStore,
  TaskStoreMetadata,
  any,
  TaskEvents[]
> = {
  name: 'subscribeTask',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareTaskStoreQuery,
  async execute(taskStore) {
    return emitter => [taskStore.subscribe(emitter)];
  },
};
