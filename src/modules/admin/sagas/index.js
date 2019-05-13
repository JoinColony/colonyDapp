/* @flow */

import type { Saga } from 'redux-saga';

import { call, fork, put, takeEvery, select } from 'redux-saga/effects';

import type { Action } from '~redux';

import {
  takeFrom,
  putError,
  executeCommand,
  executeQuery,
  putNotification,
} from '~utils/saga/effects';
import { ACTIONS } from '~redux';

import { getColony } from '../../dashboard/data/queries';
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
import { walletAddressSelector } from '../../users/selectors';

import { NOTIFICATION_EVENT_TOKENS_MINTED } from '~users/Inbox/events';

function* colonyTransactionsFetch({
  payload: { colonyAddress },
  meta,
}: Action<typeof ACTIONS.COLONY_TRANSACTIONS_FETCH>): Saga<void> {
  try {
    const transactions = yield* executeQuery(getColonyTransactions, {
      metadata: {
        colonyAddress,
      },
    });

    yield put<Action<typeof ACTIONS.COLONY_TRANSACTIONS_FETCH_SUCCESS>>({
      type: ACTIONS.COLONY_TRANSACTIONS_FETCH_SUCCESS,
      meta,
      payload: { colonyAddress, transactions },
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_TRANSACTIONS_FETCH_ERROR, error, meta);
  }
}

function* colonyUnclaimedTransactionsFetch({
  payload: { colonyAddress },
  meta,
}: Action<typeof ACTIONS.COLONY_UNCLAIMED_TRANSACTIONS_FETCH>): Saga<void> {
  try {
    const transactions = yield* executeQuery(getColonyUnclaimedTransactions, {
      metadata: { colonyAddress },
    });

    yield put<
      Action<typeof ACTIONS.COLONY_UNCLAIMED_TRANSACTIONS_FETCH_SUCCESS>,
    >({
      type: ACTIONS.COLONY_UNCLAIMED_TRANSACTIONS_FETCH_SUCCESS,
      meta,
      payload: { colonyAddress, transactions },
    });
  } catch (error) {
    yield putError(
      ACTIONS.COLONY_UNCLAIMED_TRANSACTIONS_FETCH_ERROR,
      error,
      meta,
    );
  }
}

/*
 * Claim tokens, then reload unclaimed transactions list.
 */
function* colonyClaimToken({
  payload: { colonyAddress, tokenAddress },
  meta,
}: Action<typeof ACTIONS.COLONY_CLAIM_TOKEN>): Saga<void> {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, meta.id);
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'claimColonyFunds',
      identifier: colonyAddress,
      params: { token: tokenAddress },
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
    yield put<Action<typeof ACTIONS.COLONY_TRANSACTIONS_FETCH>>(
      fetchColonyTransactions(colonyAddress),
    );
    yield put<Action<typeof ACTIONS.COLONY_UNCLAIMED_TRANSACTIONS_FETCH>>(
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
  payload,
  meta,
}: Action<typeof ACTIONS.COLONY_UPDATE_TOKENS>): Saga<void> {
  try {
    /*
     * @todo Consider fetching tokens from state
     * @body Consider fetching tokens from state instead of executing a query before updating colony tokens
     */
    const { tokens: currentTokenReferences = {} } = yield* executeQuery(
      getColony,
      {
        metadata: { colonyAddress },
      },
    );
    yield* executeCommand(updateTokenInfo, {
      metadata: { colonyAddress },
      args: { tokens, currentTokenReferences },
    });
    yield put(fetchColony(colonyAddress));

    // We could consider dispatching an action to fetch tokens when
    // successfully updating them
    yield put({ type: ACTIONS.COLONY_UPDATE_TOKENS_SUCCESS, payload });
  } catch (error) {
    yield putError(ACTIONS.COLONY_UPDATE_TOKENS_ERROR, error, meta);
  }
}

function* colonyMintTokens({
  payload: { amount, colonyAddress },
  meta,
}: Action<typeof ACTIONS.COLONY_MINT_TOKENS>): Saga<void> {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, meta.id);
    /*
     * Get the current user's wallet address (we need that for notifications)
     */
    const walletAddress = yield select(walletAddressSelector);
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'mintTokens',
      identifier: colonyAddress,
      params: { amount },
    });

    yield put({ type: ACTIONS.COLONY_MINT_TOKENS_SUBMITTED });

    const {
      payload: {
        params: { amount: mintedAmount },
        transaction: { receipt },
      },
    } = yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    /*
      if we got a Mint event log back (we will have on success) get the
      contract address it's from, and refetch the colony's balance for it
    */
    const mintLog = receipt.logs[0];
    if (mintLog) {
      const tokenAddress = mintLog.address;
      yield put<Action<typeof ACTIONS.COLONY_TOKEN_BALANCE_FETCH>>({
        type: ACTIONS.COLONY_TOKEN_BALANCE_FETCH,
        payload: { colonyAddress, tokenAddress },
      });
    }

    yield put<Action<typeof ACTIONS.COLONY_MINT_TOKENS_SUCCESS>>({
      type: ACTIONS.COLONY_MINT_TOKENS_SUCCESS,
      payload: { amount: mintedAmount },
      meta,
    });

    /*
     * Notification
     */
    yield putNotification({
      amount: mintedAmount,
      colonyAddress,
      event: NOTIFICATION_EVENT_TOKENS_MINTED,
      sourceUserAddress: walletAddress,
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_MINT_TOKENS_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
  }
}

export default function* adminSagas(): Saga<void> {
  yield takeEvery(ACTIONS.COLONY_TRANSACTIONS_FETCH, colonyTransactionsFetch);
  yield takeEvery(
    ACTIONS.COLONY_UNCLAIMED_TRANSACTIONS_FETCH,
    colonyUnclaimedTransactionsFetch,
  );
  yield takeEvery(ACTIONS.COLONY_CLAIM_TOKEN, colonyClaimToken);
  yield takeEvery(ACTIONS.COLONY_UPDATE_TOKENS, colonyUpdateTokens);
  yield takeEvery(ACTIONS.COLONY_MINT_TOKENS, colonyMintTokens);
}
