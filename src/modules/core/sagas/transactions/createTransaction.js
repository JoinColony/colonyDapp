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

export function* createTransaction(
  id: string,
  config: TxConfig<*>,
): Saga<void> {
  const address = yield select(walletAddressSelector);

  if (!address) {
    throw new Error(
      'Could not create transaction. No current user address available',
    );
  }

  if (!id) {
    throw new Error('Could not create transaction. No transaction id provided');
  }

  // Put transaction into store
  const txAction = createTxAction(id, address, config);
  yield put<Action<typeof txAction.type>>(txAction);

  // Take the action where the user estimates the gas cost
  const task = yield takeEvery(
    filterUniqueAction(id, ACTIONS.TRANSACTION_ESTIMATE_GAS),
    estimateGasCost,
  );

  //  Take the action where the user sends off the transaction
  yield take(filterUniqueAction(id, ACTIONS.TRANSACTION_SEND));

  yield call(sendTransaction, id);

  yield cancel(task);
}

export function* getTxChannel(id: string): Saga<Channel<*>> {
  return yield actionChannel(filterUniqueAction(id), buffers.fixed());
}

export function* createTransactionChannels(
  batchId: string,
  ids: string[],
): Saga<[{ [id: string]: string }, { [id: string]: Channel<*> }]> {
  const txIds = ids.map(id => `${batchId}-${id}`);
  const txChannels = yield all(txIds.map(txId => call(getTxChannel, txId)));
  return ids.reduce(
    ([txIdsObj, txChannelsObj], id, i) => [
      { ...txIdsObj, [id]: txIds[i] },
      { ...txChannelsObj, [id]: txChannels[i] },
    ],
    [{}, {}],
  );
}
