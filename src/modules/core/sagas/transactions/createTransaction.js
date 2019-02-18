/* @flow */

import type { Channel, Saga } from 'redux-saga';
import type { SendOptions } from '@colony/colony-js-client';

import { buffers } from 'redux-saga';
import {
  actionChannel,
  call,
  cancel,
  put,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects';
import nanoid from 'nanoid';

import { currentUserAddressSelector } from '../../../users/selectors';

import {
  MULTISIG_TRANSACTION_CREATED,
  TRANSACTION_CREATED,
  TRANSACTION_ESTIMATE_GAS,
  TRANSACTION_SEND,
} from '../../actionTypes';

import estimateGasCost from './estimateGasCost';
import sendTransaction from './sendTransaction';

type TxConfig<P> = {|
  context: string,
  identifier?: string,
  methodName: string,
  group?: {|
    key: string,
    id: string | string[],
    index: number,
  |},
  multisig?: boolean | {},
  params?: P,
  options?: SendOptions,
|};

const createTxAction = <P>(
  id,
  from,
  {
    context,
    identifier,
    methodName,
    group,
    multisig: multisigConfig,
    params,
    options,
  }: TxConfig<P>,
) => ({
  type: multisigConfig ? MULTISIG_TRANSACTION_CREATED : TRANSACTION_CREATED,
  payload: {
    context,
    createdAt: new Date(),
    from,
    group,
    identifier,
    methodName,
    multisig: typeof multisigConfig == 'boolean' ? {} : multisigConfig,
    options,
    params,
  },
  meta: { id: id || nanoid() },
});

const filterAction = (action, id, type?: string) =>
  !!action.meta &&
  action.meta.id === id &&
  (type ? action.type === type : true);

export function* createTransaction(
  id: string,
  config: TxConfig<*>,
): Saga<void> {
  const address = yield select(currentUserAddressSelector);

  if (!address) {
    throw new Error(
      'Could not create transaction. No current user address available',
    );
  }

  // Put transaction into store
  yield put(createTxAction(id, address, config));

  // Take the action where the user estimates the gas cost
  const task = yield takeEvery(
    action => filterAction(action, id, TRANSACTION_ESTIMATE_GAS),
    estimateGasCost,
  );

  //  Take the action where the user sends off the transaction
  yield take(action => filterAction(action, id, TRANSACTION_SEND));

  yield call(sendTransaction, id);

  yield cancel(task);
}

export function* getTxChannel(id: string): Saga<Channel<*>> {
  return yield actionChannel(
    action => filterAction(action, id),
    buffers.fixed(),
  );
}
