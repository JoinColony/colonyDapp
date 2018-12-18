/* @flow */

import type { Saga } from 'redux-saga';

import { call, getContext, put, takeEvery } from 'redux-saga/effects';

import type { Action } from '~types';
import type { ColonyTransactionProps } from '~immutable';

import { putError, callCaller } from '~utils/saga/effects';

import {
  COLONY_FETCH_TRANSACTIONS_ERROR,
  COLONY_FETCH_TRANSACTIONS_SUCCESS,
  COLONY_FETCH_TRANSACTIONS,
} from '../actionTypes';

function* fetchColonyTransactionsSaga(action: Action): Saga<void> {
  const { ensName } = action.payload;
  const colonyManager = yield getContext('colonyManager');

  try {
    const colonyClient = yield call(
      [colonyManager, colonyManager.getColonyClient],
      ensName,
    );
    const { provider } = colonyClient.adapter;

    const filter = {
      address: colonyClient.contract.address,
      fromBlock: 0, // TODO: set this properly
      toBlock: 'latest',
      eventNames: [
        'ColonyFundsClaimed',
        'ColonyFundsMovedBetweenFundingPots',
        'TaskPayoutClaimed',
      ],
    };

    const logs = yield call([colonyClient, colonyClient.getLogs], filter);
    const events = yield call([colonyClient, colonyClient.parseLogs], logs);

    const transactions: Array<ColonyTransactionProps> = [];
    for (let i = 0; i < events.length; i += 1) {
      const { eventName } = events[i];
      const { transactionHash, blockHash } = logs[i];
      const { timestamp } = yield call(
        [provider, provider.getBlock],
        blockHash,
      );
      if (eventName === 'ColonyFundsClaimed') {
        const { payoutRemainder: amount, token } = events[i];
        const { address: to } = logs[i];
        const { from } = yield call(
          [provider, provider.getTransaction],
          transactionHash,
        );
        transactions.push({
          amount,
          from,
          to,
          token,
          incoming: true,
          date: new Date(timestamp),
          transactionHash,
        });
      } else if (eventName === 'ColonyFundsMovedBetweenFundingPots') {
        // const { amount, fromPot, token, toPot } = events[i];
        // const [, taskId] = yield call(
        //   [colonyClient.contract, colonyClient.contract.pots],
        //   fromPot === 1 ? toPot : fromPot,
        // );
        // transactions.push({
        //   amount,
        //   taskId,
        //   token,
        //   incoming: fromPot !== 1,
        //   date: new Date(timestamp),
        //   transactionHash,
        // });
      } else if (eventName === 'TaskPayoutClaimed') {
        const { taskId, role, amount, token } = events[i];
        const { address: to } = yield callCaller({
          colonyENSName: ensName,
          methodName: 'getTaskRole',
          params: { taskId, role },
        });
        transactions.push({
          amount,
          taskId,
          to,
          token,
          incoming: false,
          date: new Date(timestamp),
          transactionHash,
        });
      }
    }

    yield put({
      type: COLONY_FETCH_TRANSACTIONS_SUCCESS,
      payload: { transactions, ensName },
    });
  } catch (error) {
    yield putError(COLONY_FETCH_TRANSACTIONS_ERROR, error);
  }
}

export default function* colonySagas(): any {
  yield takeEvery(COLONY_FETCH_TRANSACTIONS, fetchColonyTransactionsSaga);
}
