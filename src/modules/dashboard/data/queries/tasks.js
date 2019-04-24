/* @flow */

import type { Address } from '~types';
import type { TaskDraftId } from '~immutable';

import type { ColonyManager, DDB, Query, Wallet, TaskStore } from '~data/types';

import { CONTEXT } from '~context';
import { TASK_EVENT_TYPES } from '~data/constants';

import { getTaskStore, getTaskStoreAddress } from '~data/stores';
import { taskReducer } from '../reducers';

/*
 * TODO: There's a confusion around query metadata, store metadata, this is a mess!
 * I need to fix that as well but for now I wanna get c/q ready.
 */
type TaskStoreMetadata = {| colonyAddress: Address, draftId: TaskDraftId |};

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
   * TODO: Getters should return a store **ONLY** by address, so we can end this mess. We need a StoreLocator
   * with resolvers that can infer the address for deterministic address stores so the dapp can get that address easily
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
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareTaskStoreQuery,
  async execute(taskStore) {
    return taskStore
      .all()
      .filter(({ type: eventType }) => TASK_EVENT_TYPES[eventType])
      .reduce(taskReducer, {
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
        paymentToken: undefined,
        requests: [],
        skillId: undefined,
        status: undefined,
        title: undefined,
        workerAddress: undefined,
      });
  },
};
