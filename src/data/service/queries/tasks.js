/* @flow */

import type { Address, ENSName, OrbitDBAddress } from '~types';

import type {
  ColonyClientContext,
  ContextWithMetadata,
  DDBContext,
  Query,
  WalletContext,
} from '../../types';

import { getTaskStore } from '../../stores';
import { getTaskReducer } from '../reducers';
import { TASK_EVENT_TYPES } from '../../constants';

export type TaskQueryContext = ContextWithMetadata<
  {|
    colonyENSName: string | ENSName,
    colonyAddress: Address,
    taskStoreAddress: string | OrbitDBAddress,
  |},
  ColonyClientContext & DDBContext & WalletContext,
>;

export type TaskQuery<I: *, R: *> = Query<TaskQueryContext, I, R>;

// TODO: We should be able to merge contract events here as well
// eslint-disable-next-line import/prefer-default-export
export const getTask: TaskQuery<*, *> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { colonyAddress, colonyENSName, taskStoreAddress },
}) => ({
  async execute() {
    const taskStore = await getTaskStore(colonyClient, ddb, wallet)({
      colonyAddress,
      colonyENSName,
      taskStoreAddress,
    });

    return taskStore
      .all()
      .filter(({ type: eventType }) => TASK_EVENT_TYPES[eventType])
      .reduce(getTaskReducer, {
        // TODO get these defaults from some model elsewhere? See #965
        amountPaid: undefined,
        commentsStoreAddress: '', // XXX Just to appease flow; it'll be there
        createdAt: undefined,
        creator: undefined,
        description: undefined,
        domainId: undefined,
        draftId: '', // XXX Just to appease flow; it'll be there
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
        worker: undefined,
      });
  },
});
