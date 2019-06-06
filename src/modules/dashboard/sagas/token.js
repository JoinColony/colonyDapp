/* @flow */

import type { Saga } from 'redux-saga';

import {
  call,
  delay,
  fork,
  put,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';

import type { Action } from '~redux';

import { putError, takeFrom } from '~utils/saga/effects';
import { ZERO_ADDRESS, ETHER_INFO } from '~utils/web3/constants';
import { CONTEXT, getContext } from '~context';
import { ACTIONS } from '~redux';

import { createTransaction, getTxChannel } from '../../core/sagas';
import { NETWORK_CONTEXT } from '../../core/constants';

/**
 * Get the token info for a given `tokenAddress`.
 */
function* tokenInfoFetch({
  payload: { tokenAddress },
  meta,
}: Action<typeof ACTIONS.TOKEN_INFO_FETCH>): Saga<void> {
  // if trying to fetch info for Ether, return hardcoded
  if (tokenAddress === ZERO_ADDRESS) {
    yield put<Action<typeof ACTIONS.TOKEN_INFO_FETCH_SUCCESS>>({
      type: ACTIONS.TOKEN_INFO_FETCH_SUCCESS,
      payload: ETHER_INFO,
      meta,
    });
  }

  // Debounce with 1000ms, since this is intended to run directly following
  // user keyboard input.

  yield delay(1000);

  try {
    /**
     * Given a token contract address, create a `TokenClient` with the minimal
     * token ABI loader and get the token info. The promise will be rejected if
     * the functions do not exist on the contract.
     */
    const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
    const client = yield call(
      [colonyManager, colonyManager.getTokenClient],
      tokenAddress,
    );
    const info = client.getTokenInfo.call();
    yield put<Action<typeof ACTIONS.TOKEN_INFO_FETCH_SUCCESS>>({
      type: ACTIONS.TOKEN_INFO_FETCH_SUCCESS,
      payload: { ...info, tokenAddress },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TOKEN_INFO_FETCH_ERROR, error, meta);
  }
}

function* tokenCreate({
  payload: { tokenName: name, tokenSymbol: symbol },
  meta,
}: Action<typeof ACTIONS.TOKEN_CREATE>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: NETWORK_CONTEXT,
      methodName: 'createToken',
      params: { name, symbol },
    });
    // These are just temporary for now until we have the new onboarding workflow Normally these are done by the user
    yield put({
      type: ACTIONS.TRANSACTION_ESTIMATE_GAS,
      meta,
    });
    yield takeFrom(txChannel, ACTIONS.TRANSACTION_GAS_UPDATE);
    yield put({
      type: ACTIONS.TRANSACTION_SEND,
      meta,
    });

    const { payload } = yield takeFrom(
      txChannel,
      ACTIONS.TRANSACTION_RECEIPT_RECEIVED,
    );
    yield put({
      type: ACTIONS.TOKEN_CREATE_SUCCESS,
      payload,
      meta,
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);
  } catch (error) {
    yield putError(ACTIONS.TOKEN_CREATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* tokenSagas(): Saga<void> {
  yield takeEvery(ACTIONS.TOKEN_CREATE, tokenCreate);
  // Note that this is `takeLatest` because it runs on user keyboard input
  // and uses the `delay` saga helper.
  yield takeLatest(ACTIONS.TOKEN_INFO_FETCH, tokenInfoFetch);
}
