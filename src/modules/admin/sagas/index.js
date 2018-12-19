/* @flow */

import type { Saga } from 'redux-saga';

import { call, getContext, put, takeEvery } from 'redux-saga/effects';

import type { Action } from '~types';
import type { ContractTransactionProps } from '~immutable';

import { putError, callCaller } from '~utils/saga/effects';

import {
  COLONY_FETCH_TRANSACTIONS_ERROR,
  COLONY_FETCH_TRANSACTIONS_SUCCESS,
  COLONY_FETCH_TRANSACTIONS,
} from '../actionTypes';

function* fetchColonyTransactionsSaga(action: Action): Saga<void> {
  const { ensName: colonyENSName } = action.payload;
  const colonyManager = yield getContext('colonyManager');

  try {
    const colonyClient = yield call(
      [colonyManager, colonyManager.getColonyClient],
      colonyENSName,
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

    const transactions: Array<ContractTransactionProps> = [];
    for (let i = 0; i < events.length; i += 1) {
      const { eventName } = events[i];
      const { transactionHash, blockHash } = logs[i];
      const { timestamp } = yield call(
        [provider, provider.getBlock],
        blockHash,
      );
      const date = new Date(timestamp);
      if (eventName === 'ColonyFundsClaimed') {
        const { payoutRemainder: amount, token } = events[i];
        const { from } = yield call(
          [provider, provider.getTransaction],
          transactionHash,
        );
        transactions.push({
          amount,
          colonyENSName,
          date,
          from,
          id: transactionHash,
          incoming: true,
          token,
          hash: transactionHash,
        });
      } else if (eventName === 'ColonyFundsMovedBetweenFundingPots') {
        const { amount, fromPot, token } = events[i];
        // TODO: replace this once able to get taskId from potId
        const taskId = 1;
        // const [, taskId] = yield call(
        //   [colonyClient.contract, colonyClient.contract.pots],
        //   events[i].fromPot === 1 ? events[i].toPot : events[i].fromPot,
        // );
        transactions.push({
          amount,
          colonyENSName,
          date,
          id: transactionHash,
          incoming: fromPot !== 1,
          taskId,
          token,
          hash: transactionHash,
        });
      } else if (eventName === 'TaskPayoutClaimed') {
        const { taskId, role, amount, token } = events[i];
        const { address: to } = yield callCaller({
          colonyENSName,
          methodName: 'getTaskRole',
          params: { taskId, role },
        });
        transactions.push({
          amount,
          date,
          id: transactionHash,
          incoming: false,
          taskId,
          to,
          token,
          hash: transactionHash,
        });
      }
    }

    yield put({
      type: COLONY_FETCH_TRANSACTIONS_SUCCESS,
      payload: { transactions, ensName: colonyENSName },
    });
  } catch (error) {
    yield putError(COLONY_FETCH_TRANSACTIONS_ERROR, error);
  }
}

export default function* colonySagas(): any {
  yield takeEvery(COLONY_FETCH_TRANSACTIONS, fetchColonyTransactionsSaga);
}
