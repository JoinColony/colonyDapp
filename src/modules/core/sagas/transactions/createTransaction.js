/* @flow */

import type { Channel, Saga } from 'redux-saga';

import { buffers } from 'redux-saga';
import {
  actionChannel,
  all,
  call,
  cancel,
  put,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects';

import type { Action } from '~redux';

import { ACTIONS } from '~redux';

import type { TxConfig } from '../../types';

import { filterUniqueAction } from '~utils/actions';

import { walletAddressSelector } from '../../../users/selectors';

import { createTxAction } from '../../actionCreators';

import estimateGasCost from './estimateGasCost';
import sendTransaction from './sendTransaction';

export function* createTransaction(id: string, config: TxConfig): Saga<void> {
  const address = yield select(walletAddressSelector);

  if (!address) {
    throw new Error(
      'Could not create transaction. No current user address available',
    );
  }

  if (!id) {
    throw new Error('Could not create transaction. No transaction id provided');
  }

  yield put<
    Action<
      | typeof ACTIONS.TRANSACTION_CREATED
      | typeof ACTIONS.MULTISIG_TRANSACTION_CREATED,
    >,
  >(createTxAction(id, address, config));

  // Create tasks for estimating and sending; the actions may be taken multiple times
  const estimateGasTask = yield takeEvery(
    filterUniqueAction(id, ACTIONS.TRANSACTION_ESTIMATE_GAS),
    estimateGasCost,
  );
  const sendTask = yield takeEvery(
    filterUniqueAction(id, ACTIONS.TRANSACTION_SEND),
    sendTransaction,
  );

  // Wait for a success or cancel action before cancelling the tasks
  yield take(
    action =>
      (action.type === ACTIONS.TRANSACTION_SUCCEEDED ||
        action.type === ACTIONS.TRANSACTION_CANCEL) &&
      action.meta.id === id,
  );
  yield cancel([estimateGasTask, sendTask]);
}

export function* getTxChannel(id: string): Saga<Channel<*>> {
  return yield actionChannel(filterUniqueAction(id), buffers.fixed());
}

export function* createTransactionChannels(
  batchId: string,
  ids: string[],
): Saga<{
  [id: string]: {| channel: Channel<*>, index: number, id: string |},
}> {
  const txIds = ids.map(id => `${batchId}-${id}`);
  const channels = yield all(txIds.map(id => call(getTxChannel, id)));
  return ids.reduce(
    (result, id, index) => ({
      ...result,
      [id]: { index, channel: channels[index], id: txIds[index] },
    }),
    {},
  );
}
