/* @flow */

import type { Address, ENSName, OrbitDBAddress } from '~types';
import type { TaskDraftId } from '~immutable';

import type {
  ColonyClientContext,
  ContextWithMetadata,
  DDBContext,
  Query,
  WalletContext,
} from '~data/types';

import { taskReducer } from '../reducers';
import { getTaskStore } from '~data/stores';
import { TASK_EVENT_TYPES } from '~data/constants';

export type TaskQueryContext = ContextWithMetadata<
  {|
    colonyName: string | ENSName,
    colonyAddress: Address,
    draftId: TaskDraftId,
    taskStoreAddress: string | OrbitDBAddress,
  |},
  ColonyClientContext & DDBContext & WalletContext,
>;

export type TaskQuery<I: *, R: *> = Query<TaskQueryContext, I, R>;

/**
 * @todo Merge contract events into getTask query.
 */
// eslint-disable-next-line import/prefer-default-export
export const getTask: TaskQuery<*, *> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { colonyAddress, colonyName, draftId, taskStoreAddress },
}) => ({
  async execute() {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)({
      colonyAddress,
      colonyName,
      draftId,
      taskStoreAddress,
    });

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
});
