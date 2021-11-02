import { Channel, buffers } from 'redux-saga';
import {
  actionChannel,
  all,
  call,
  cancel,
  put,
  take,
  takeEvery,
} from 'redux-saga/effects';

import { ActionTypes } from '~redux/index';
import { filterUniqueAction } from '~utils/actions';
import { getLoggedInUser, getCanUserSendMetatransactions } from '~data/index';
import { takeFrom } from '~utils/saga/effects';
import { TxConfig } from '~types/index';

import { createTransactionAction } from '../../actionCreators';
import estimateGasCost from './estimateGasCost';
import sendTransaction from './sendTransaction';

export function* createTransaction(id: string, config: TxConfig) {
  const { walletAddress } = yield getLoggedInUser();
  const shouldSendMetatransaction = yield getCanUserSendMetatransactions();

  if (!walletAddress) {
    throw new Error(
      'Could not create transaction. No current user address available',
    );
  }

  if (!id) {
    throw new Error('Could not create transaction. No transaction id provided');
  }

  if (shouldSendMetatransaction) {
    yield put(
      createTransactionAction(id, walletAddress, {
        ...config,
        metatransaction:
          /*
           * This allows us to manually "force" a transaction to never be executed
           * as a Metatransaction
           *
           * This is useful in places where we have transactions we don't want to
           * pay for ourselves.
           *
           * However this is VERY DANGEROUS, so must be treated with the utmost care
           * as it has very serious gas cost implications if the user is not aware
           * they are sending a transaction on mainnet !!!
           */
          typeof config.metatransaction === 'boolean'
            ? config.metatransaction
            : true,
      }),
    );
  } else {
    yield put(createTransactionAction(id, walletAddress, config));
  }

  // Create tasks for estimating and sending; the actions may be taken multiple times
  let estimateGasTask;
  if (!shouldSendMetatransaction) {
    estimateGasTask = yield takeEvery(
      filterUniqueAction(id, ActionTypes.TRANSACTION_ESTIMATE_GAS),
      estimateGasCost,
    );
  }

  const sendTransactionTask = yield takeEvery(
    filterUniqueAction(id, ActionTypes.TRANSACTION_SEND),
    sendTransaction,
  );

  // Wait for a success or cancel action before cancelling the tasks
  yield take(
    (action) =>
      (action.type === ActionTypes.TRANSACTION_SUCCEEDED ||
        action.type === ActionTypes.TRANSACTION_CANCEL) &&
      action.meta.id === id,
  );

  const tasks = [sendTransactionTask];
  if (estimateGasTask) {
    tasks.push(estimateGasTask);
  }

  yield cancel(tasks);
}

export function* getTxChannel(id: string) {
  return yield actionChannel(filterUniqueAction(id), buffers.fixed());
}

export interface ChannelDefinition {
  channel: Channel<any>;
  index: number;
  id: string;
}

export function* createTransactionChannels(
  batchId: string,
  ids: string[],
  customIndex = 0,
): IterableIterator<{
  [id: string]: { channel: Channel<any>; index: number; id: string };
}> {
  const txIds = ids.map((id) => `${batchId}-${id}`);
  const channels = yield all(txIds.map((id) => call(getTxChannel, id))) as any;
  return ids.reduce(
    (result, id, index) => ({
      ...result,
      [id]: {
        index: customIndex + index,
        channel: (channels as any)[index],
        id: txIds[index],
      },
    }),
    {},
  );
}

export function* waitForTxResult(channel: Channel<any>) {
  const result = yield takeFrom(channel, [
    ActionTypes.TRANSACTION_ERROR,
    ActionTypes.TRANSACTION_SUCCEEDED,
    ActionTypes.TRANSACTION_CANCEL,
  ]);

  if (result.type === ActionTypes.TRANSACTION_ERROR) {
    throw new Error('Transaction failed');
  }
}
