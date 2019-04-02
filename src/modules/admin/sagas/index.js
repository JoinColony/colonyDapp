/* @flow */

import type { Saga } from 'redux-saga';

import { call, fork, put, takeEvery } from 'redux-saga/effects';

import type { Action } from '~redux';

import {
  takeFrom,
  putError,
  executeCommand,
  executeQuery,
} from '~utils/saga/effects';
import { CONTEXT, getContext } from '~context';
import { ACTIONS } from '~redux';

import {
  getColonyTransactions,
  getColonyUnclaimedTransactions,
} from '../data/queries';
import { updateTokenInfo } from '../../dashboard/data/commands';
import { createTransaction, getTxChannel } from '../../core/sagas';
import { COLONY_CONTEXT } from '../../core/constants';
import {
  fetchColonyTransactions,
  fetchColonyUnclaimedTransactions,
} from '../actionCreators';
import { fetchColony } from '../../dashboard/actionCreators';
import { getColonyContext } from '../../dashboard/sagas/shared';

function* colonyFetchTransactions({
  payload: { colonyAddress },
  meta,
}: Action<typeof ACTIONS.COLONY_FETCH_TRANSACTIONS>): Saga<void> {
  try {
    const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);

    const colonyClient = yield call(
      [colonyManager, colonyManager.getColonyClient],
      colonyAddress,
    );

    const transactions = yield* executeQuery(
      {
        colonyClient,
        metadata: {
          colonyAddress,
        },
      },
      getColonyTransactions,
    );

    yield put<Action<typeof ACTIONS.COLONY_FETCH_TRANSACTIONS_SUCCESS>>({
      type: ACTIONS.COLONY_FETCH_TRANSACTIONS_SUCCESS,
      meta,
      payload: transactions,
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_FETCH_TRANSACTIONS_ERROR, error, meta);
  }
}

function* colonyFetchUnclaimedTransactions({
  payload: { colonyAddress },
  meta,
}: Action<typeof ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS>): Saga<void> {
  try {
    const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
    const colonyClient = yield call(
      [colonyManager, colonyManager.getColonyClient],
      colonyAddress,
    );

    const transactions = yield* executeQuery(
      {
        colonyClient,
        metadata: { colonyAddress },
      },
      getColonyUnclaimedTransactions,
    );

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

/*
 * Claim tokens, then reload unclaimed transactions list.
 */
function* colonyClaimToken({
  payload: { colonyAddress, tokenAddress: token },
  meta,
}: Action<typeof ACTIONS.COLONY_CLAIM_TOKEN>): Saga<void> {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, meta.id);
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'claimColonyFunds',
      identifier: colonyAddress,
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
      fetchColonyTransactions(colonyAddress),
    );
    yield put<Action<typeof ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS>>(
      fetchColonyUnclaimedTransactions(colonyAddress),
    );
  } catch (error) {
    yield putError(ACTIONS.COLONY_CLAIM_TOKEN_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
  }
}

function* colonyUpdateTokens({
  payload: { colonyAddress, tokens },
  meta,
}: Action<typeof ACTIONS.COLONY_UPDATE_TOKENS>): Saga<void> {
  try {
    const context = yield* getColonyContext(colonyAddress);
    yield* executeCommand(context, updateTokenInfo, {
      tokens,
    });
    yield put(fetchColony(colonyAddress)); // TODO: just fetch tokens
    yield put({ type: ACTIONS.COLONY_UPDATE_TOKENS_SUCCESS, meta });
  } catch (error) {
    yield putError(ACTIONS.COLONY_UPDATE_TOKENS_ERROR, error, meta);
  }
}

export default function* adminSagas(): Saga<void> {
  yield takeEvery(ACTIONS.COLONY_FETCH_TRANSACTIONS, colonyFetchTransactions);
  yield takeEvery(
    ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
    colonyFetchUnclaimedTransactions,
  );
  yield takeEvery(ACTIONS.COLONY_CLAIM_TOKEN, colonyClaimToken);
  yield takeEvery(ACTIONS.COLONY_UPDATE_TOKENS, colonyUpdateTokens);
}
