/* @flow */

import type { Saga } from 'redux-saga';

import { providers } from 'ethers';
import ColonyNetworkClient from '@colony/colony-js-client';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import { delay } from 'redux-saga';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { replace } from 'connected-react-router';

import { putError } from '~utils/saga/effects';
import { DASHBOARD_ROUTE } from '~routes';

// A minimal version of the `Token.sol` ABI, with only `name`, `symbol` and
// `decimals` entries included.
import TokenABI from './TokenABI.json';

import { networkMethodSagaFactory } from '../../core/sagas/networkClient';

import {
  COLONY_CREATE,
  COLONY_CREATE_ERROR,
  COLONY_CREATE_SUCCESS,
  TOKEN_CREATE,
  TOKEN_CREATE_ERROR,
  TOKEN_CREATE_SUCCESS,
  TOKEN_INFO_FETCH,
  TOKEN_INFO_FETCH_ERROR,
  TOKEN_INFO_FETCH_SUCCESS,
} from '../actionTypes';

/**
 * On successful colony creation, redirect to the dashboard.
 */
function* createColonySuccess(): Saga<void> {
  yield put(replace(DASHBOARD_ROUTE));
}

/**
 * Rather than use e.g. the Etherscan loader and make more/larger requests than
 * necessary, provide a loader to simply return the minimal Token ABI and the
 * given token contract address.
 */
const tokenABILoader = {
  async load({ contractAddress: address }) {
    return { abi: TokenABI, address };
  },
};

/**
 * Given a token contract address, create a `TokenClient` with the minimal
 * token ABI loader and get the token info. The promise will be rejected if
 * the functions do not exist on the contract.
 */
async function getTokenClientInfo(contractAddress: string) {
  const provider = new providers.EtherscanProvider();
  const adapter = new EthersAdapter({
    // $FlowFixMe The `ContractLoader` type is currently not exported
    loader: tokenABILoader,
    provider,
    // $FlowFixMe This minimal provider doesn't have all Provider features
    wallet: { provider },
  });

  const client = new ColonyNetworkClient.TokenClient({
    adapter,
    query: { contractAddress },
  });

  await client.init();

  return client.getTokenInfo.call();
}

/**
 * Get the token info for a given `tokenAddress`.
 */
function* getTokenInfo({ payload: { tokenAddress } }): Saga<void> {
  // Debounce with 1000ms, since this is intended to run directly following
  // user keyboard input.

  yield call(delay, 1000);

  let info;
  try {
    // Attempt to get the token info from a new `TokenClient` instance.
    info = yield call(getTokenClientInfo, tokenAddress);
  } catch (error) {
    yield putError(TOKEN_INFO_FETCH_ERROR, error);
    return;
  }
  yield put({ type: TOKEN_INFO_FETCH_SUCCESS, payload: info });
}

// Generate sagas for the methods on the network client which we are
// currently using.
const createColony = networkMethodSagaFactory<
  { tokenAddress: string },
  { colonyAddress: string, colonyId: number },
>('createColony', {
  success: COLONY_CREATE_SUCCESS,
  error: COLONY_CREATE_ERROR,
});
const createToken = networkMethodSagaFactory<
  { name: string, symbol: string },
  {},
>('createToken', { success: TOKEN_CREATE_SUCCESS, error: TOKEN_CREATE_ERROR });

export default function* colonySagas(): any {
  yield takeEvery(COLONY_CREATE, createColony);
  yield takeEvery(COLONY_CREATE_SUCCESS, createColonySuccess);
  yield takeEvery(TOKEN_CREATE, createToken);

  // Note that this is `takeLatest` because it runs on user keyboard input
  // and uses the `delay` saga helper.
  yield takeLatest(TOKEN_INFO_FETCH, getTokenInfo);
}
