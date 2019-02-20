/* @flow */

import type { Saga } from 'redux-saga';

import { call, fork, put, takeEvery, all } from 'redux-saga/effects';

import type { ContractTransactionType } from '~immutable';
import type { Action } from '~redux';

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
import { COLONY_CONTEXT } from '../../core/constants';

import {
  fetchColonyTransactions,
  fetchColonyUnclaimedTransactions,
} from '../actionCreators';
import { ACTIONS } from '~redux';

const EVENT_PARSERS = {
  ColonyFundsClaimed: parseColonyFundsClaimedEvent,
  // eslint-disable-next-line max-len
  ColonyFundsMovedBetweenFundingPots: parseColonyFundsMovedBetweenFundingPotsEvent,
  TaskPayoutClaimed: parseTaskPayoutClaimedEvent,
};

// TODO use a query for this
function* fetchColonyTransactionsSaga({
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
}: Action<typeof ACTIONS.COLONY_FETCH_TRANSACTIONS>): Saga<void> {
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

    yield put<Action<typeof ACTIONS.COLONY_FETCH_TRANSACTIONS_SUCCESS>>({
      type: ACTIONS.COLONY_FETCH_TRANSACTIONS_SUCCESS,
      meta,
      payload: transactions,
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_FETCH_TRANSACTIONS_ERROR, error, meta);
  }
}

// TODO use a query for this
function* fetchColonyUnclaimedTransactionsSaga({
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
}: Action<typeof ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS>): Saga<void> {
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
      colonyClient.tokenClient,
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

    yield put<
      Action<typeof ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS_SUCCESS>,
    >({
      type: ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS_SUCCESS,
      meta,
      payload: transactions,
    });
  } catch (error) {
    yield putError(
      ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS_ERROR,
      error,
      meta,
    );
  }
}

/**
 * Claim tokens, then reload unclaimed transactions list.
 */
function* claimColonyToken({
  payload: { ensName, tokenAddress: token },
  meta,
}: Action<typeof ACTIONS.COLONY_CLAIM_TOKEN>): Saga<void> {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, meta.id);
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'claimColonyFunds',
      identifier: ensName,
      params: { token },
    });

    const { payload } = yield takeFrom(
      txChannel,
      ACTIONS.TRANSACTION_SUCCEEDED,
    );

    yield put<Action<typeof ACTIONS.COLONY_CLAIM_TOKEN_SUCCESS>>({
      type: ACTIONS.COLONY_CLAIM_TOKEN_SUCCESS,
      payload,
      meta,
    });
    yield put<Action<typeof ACTIONS.COLONY_FETCH_TRANSACTIONS>>(
      fetchColonyTransactions(ensName),
    );
    yield put<Action<typeof ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS>>(
      fetchColonyUnclaimedTransactions(ensName),
    );
  } catch (error) {
    yield putError(ACTIONS.COLONY_CLAIM_TOKEN_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
  }
}

export default function* adminSagas(): Saga<void> {
  yield takeEvery(
    ACTIONS.COLONY_FETCH_TRANSACTIONS,
    fetchColonyTransactionsSaga,
  );
  yield takeEvery(
    ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
    fetchColonyUnclaimedTransactionsSaga,
  );
  yield takeEvery(ACTIONS.COLONY_CLAIM_TOKEN, claimColonyToken);
}
