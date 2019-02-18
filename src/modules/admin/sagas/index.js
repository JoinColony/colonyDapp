/* @flow */

import type { Saga } from 'redux-saga';

import { call, fork, put, takeEvery, all } from 'redux-saga/effects';

import type { UniqueAction, UniqueActionWithKeyPath } from '~types';
import type { ContractTransactionType } from '~immutable';

import { takeFrom, putError } from '~utils/saga/effects';
import { CONTEXT, getContext } from '~context';

import {
  parseColonyFundsClaimedEvent,
  parseColonyFundsMovedBetweenFundingPotsEvent,
  parseTaskPayoutClaimedEvent,
  parseUnclaimedTransferEvent,
  getLogsAndEvents,
  getFilterFormattedAddress,
} from '~utils/web3/eventLogs';

import { createTransaction, getTxChannel } from '../../core/sagas';
import { TRANSACTION_SUCCEEDED } from '../../core/actionTypes';
import { COLONY_CONTEXT } from '../../core/constants';

import {
  fetchColonyTransactions,
  fetchColonyUnclaimedTransactions,
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

const EVENT_PARSERS = {
  ColonyFundsClaimed: parseColonyFundsClaimedEvent,
  // eslint-disable-next-line max-len
  ColonyFundsMovedBetweenFundingPots: parseColonyFundsMovedBetweenFundingPotsEvent,
  TaskPayoutClaimed: parseTaskPayoutClaimedEvent,
};

function* fetchColonyTransactionsSaga({
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
}: UniqueActionWithKeyPath): Saga<void> {
  try {
    const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);

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
      blocksBack: 400000,
    };
    const { logs, events } = yield call(
      getLogsAndEvents,
      partialFilter,
      colonyClient,
    );

    const transactions: Array<ContractTransactionType> = (yield all(
      events.map((event, i) =>
        EVENT_PARSERS[event.eventName]({
          event,
          log: logs[i],
          colonyClient,
          colonyENSName,
        }),
      ),
    )).filter(Boolean);

    yield put({
      type: COLONY_FETCH_TRANSACTIONS_SUCCESS,
      meta,
      payload: transactions,
    });
  } catch (error) {
    yield putError(COLONY_FETCH_TRANSACTIONS_ERROR, error, meta);
  }
}

function* fetchColonyUnclaimedTransactionsSaga({
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
}: UniqueActionWithKeyPath): Saga<void> {
  try {
    const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
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
        [getFilterFormattedAddress(colonyClient.contract.address)],
      ],
      blocksBack: 400000,
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
      blocksBack: 400000,
    };
    const { logs: claimLogs, events: claimEvents } = yield call(
      getLogsAndEvents,
      claimPartialFilter,
      colonyClient,
    );

    const transactions: Array<ContractTransactionType> = (yield all(
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
    )).filter(Boolean);

    yield put({
      type: COLONY_FETCH_UNCLAIMED_TRANSACTIONS_SUCCESS,
      meta,
      payload: transactions,
    });
  } catch (error) {
    yield putError(COLONY_FETCH_UNCLAIMED_TRANSACTIONS_ERROR, error, meta);
  }
}

/**
 * Claim tokens, then reload unclaimed transactions list.
 */
function* claimColonyToken({
  payload: { ensName, tokenAddress: token },
  meta,
}: UniqueAction): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'claimColonyFunds',
      identifier: ensName,
      params: { token },
    });

    const { payload } = yield takeFrom(txChannel, TRANSACTION_SUCCEEDED);

    yield put({
      type: COLONY_CLAIM_TOKEN_SUCCESS,
      payload,
      meta,
    });
    yield put(fetchColonyTransactions(ensName));
    yield put(fetchColonyUnclaimedTransactions(ensName));
  } catch (error) {
    yield putError(COLONY_CLAIM_TOKEN_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* adminSagas(): any {
  yield takeEvery(COLONY_FETCH_TRANSACTIONS, fetchColonyTransactionsSaga);
  yield takeEvery(
    COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
    fetchColonyUnclaimedTransactionsSaga,
  );
  yield takeEvery(COLONY_CLAIM_TOKEN, claimColonyToken);
}
