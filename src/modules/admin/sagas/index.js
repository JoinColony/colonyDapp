/* @flow */

import type { Saga } from 'redux-saga';

import { call, getContext, put, takeEvery, all } from 'redux-saga/effects';

import type { Action } from '~types';
import type { ContractTransactionProps } from '~immutable';

import { putError, raceError } from '~utils/saga/effects';

import {
  fetchColonyTransactions,
  fetchColonyUnclaimedTransactions,
  claimColonyTokenTransaction,
} from '../actionCreators';
import {
  COLONY_FETCH_TRANSACTIONS_ERROR,
  COLONY_FETCH_TRANSACTIONS_SUCCESS,
  COLONY_FETCH_TRANSACTIONS,
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS_ERROR,
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS_SUCCESS,
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
  COLONY_CLAIM_TOKEN_ERROR,
  COLONY_CLAIM_TOKEN_SUCCESS,
  COLONY_CLAIM_TOKEN,
} from '../actionTypes';

import {
  parseColonyFundsClaimedEvent,
  parseColonyFundsMovedBetweenFundingPotsEvent,
  parseTaskPayoutClaimedEvent,
  parseUnclaimedTransferEvent,
  getLogsAndEvents,
} from './utils';

function* fetchColonyTransactionsSaga(action: Action): Saga<void> {
  const { key: colonyENSName } = action.payload;
  const colonyManager = yield getContext('colonyManager');

  try {
    const colonyClient = yield call(
      [colonyManager, colonyManager.getColonyClient],
      colonyENSName,
    );

    const partialFilter = {
      address: colonyClient.contract.address,
      eventNames: [
        'ColonyFundsClaimed',
        'ColonyFundsMovedBetweenFundingPots',
        'TaskPayoutClaimed',
      ],
    };
    const { logs, events } = yield call(
      getLogsAndEvents,
      partialFilter,
      colonyClient,
    );

    const parsers = {
      ColonyFundsClaimed: parseColonyFundsClaimedEvent,
      // eslint-disable-next-line max-len
      ColonyFundsMovedBetweenFundingPots: parseColonyFundsMovedBetweenFundingPotsEvent,
      TaskPayoutClaimed: parseTaskPayoutClaimedEvent,
    };

    const transactions: Array<ContractTransactionProps> = (yield all(
      events.map((event, i) =>
        parsers[event.eventName]({
          event,
          log: logs[i],
          colonyClient,
          colonyENSName,
        }),
      ),
    )).filter(tx => !!tx);

    yield put({
      type: COLONY_FETCH_TRANSACTIONS_SUCCESS,
      payload: { transactions, key: colonyENSName },
    });
  } catch (error) {
    yield putError(COLONY_FETCH_TRANSACTIONS_ERROR, error);
  }
}

function* fetchColonyUnclaimedTransactionsSaga(action: Action): Saga<void> {
  const { key: colonyENSName } = action.payload;
  const colonyManager = yield getContext('colonyManager');

  try {
    const colonyClient = yield call(
      [colonyManager, colonyManager.getColonyClient],
      colonyENSName,
    );

    // Get logs + events for token Transfer to this Colony
    const transferPartialFilter = {
      eventNames: ['Transfer'],
      // [eventNames, from, to]
      topics: [
        [],
        undefined,
        [
          `0x000000000000000000000000${colonyClient.contract.address
            .slice(2)
            .toLowerCase()}`,
        ],
      ],
    };
    const { logs: transferLogs, events: transferEvents } = yield call(
      getLogsAndEvents,
      transferPartialFilter,
      colonyClient.token,
    );

    // Get logs + events for token claims by this Colony
    const claimPartialFilter = {
      address: colonyClient.contract.address,
      eventNames: ['ColonyFundsClaimed'],
    };
    const { logs: claimLogs, events: claimEvents } = yield call(
      getLogsAndEvents,
      claimPartialFilter,
      colonyClient,
    );

    const transactions: Array<ContractTransactionProps> = (yield all(
      transferEvents.map((transferEvent, i) =>
        call(parseUnclaimedTransferEvent, {
          transferEvent,
          transferLog: transferLogs[i],
          claimEvents,
          claimLogs,
          colonyClient,
          colonyENSName,
        }),
      ),
    )).filter(tx => !!tx);

    yield put({
      type: COLONY_FETCH_UNCLAIMED_TRANSACTIONS_SUCCESS,
      payload: { transactions, key: colonyENSName },
    });
  } catch (error) {
    yield putError(COLONY_FETCH_UNCLAIMED_TRANSACTIONS_ERROR, error);
  }
}

/**
 * Claim tokens, then reload unclaimed transactions list.
 */
function* claimColonyToken(action: Action): Saga<void> {
  const { ensName, tokenAddress: token } = action.payload;

  try {
    yield put(claimColonyTokenTransaction(ensName, { token }));
    yield raceError(COLONY_CLAIM_TOKEN_SUCCESS, COLONY_CLAIM_TOKEN_ERROR);
    yield put(fetchColonyTransactions(ensName));
    yield put(fetchColonyUnclaimedTransactions(ensName));
  } catch (error) {
    yield putError(COLONY_CLAIM_TOKEN_ERROR, error);
  }
}

export default function* colonySagas(): any {
  yield takeEvery(COLONY_FETCH_TRANSACTIONS, fetchColonyTransactionsSaga);
  yield takeEvery(
    COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
    fetchColonyUnclaimedTransactionsSaga,
  );
  yield takeEvery(COLONY_CLAIM_TOKEN, claimColonyToken);
}
