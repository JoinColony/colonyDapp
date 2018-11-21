/* @flow */

import type { Saga } from 'redux-saga';

import { providers } from 'ethers';
import ColonyNetworkClient from '@colony/colony-js-client';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import { delay } from 'redux-saga';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import type { Action } from '~types/index';

import { putError } from '~utils/saga/effects';
import { getHashedENSDomainString } from '~utils/ens';

// A minimal version of the `Token.sol` ABI, with only `name`, `symbol` and
// `decimals` entries included.
import TokenABI from './TokenABI.json';

import { getNetworkMethod } from '../../core/sagas/utils';

import {
  COLONY_CREATE,
  COLONY_DOMAIN_VALIDATE,
  COLONY_DOMAIN_VALIDATE_SUCCESS,
  COLONY_DOMAIN_VALIDATE_ERROR,
  TOKEN_CREATE,
  TOKEN_INFO_FETCH,
  TOKEN_INFO_FETCH_ERROR,
  TOKEN_INFO_FETCH_SUCCESS,
} from '../actionTypes';

import { createColony, createToken } from '../actionCreators';

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

/*
 * Simply forward on the form params to create a transaction.
 */
function* createColonySaga({ payload: params }: *): Saga<void> {
  yield put(createColony(params));
}

/*
 * Forward on the renamed form params to create a transaction.
 */
function* createTokenSaga({
  payload: { tokenName: name, tokenSymbol: symbol },
}: *): Saga<void> {
  yield put(createToken({ name, symbol }));
}

function* validateColonyDomain(action: Action): Saga<void> {
  const { ensName } = action.payload;
  yield call(delay, 300);

  const nameHash = yield call(getHashedENSDomainString, ensName, 'colony');

  const getAddressForENSHash = yield call(
    getNetworkMethod,
    'getAddressForENSHash',
  );
  const { ensAddress } = yield call(
    [getAddressForENSHash, getAddressForENSHash.call],
    { nameHash },
  );

  if (ensAddress) {
    yield putError(
      COLONY_DOMAIN_VALIDATE_ERROR,
      new Error('ENS address already exists'),
    );
    return;
  }
  yield put({ type: COLONY_DOMAIN_VALIDATE_SUCCESS });
}

export default function* colonySagas(): any {
  yield takeEvery(COLONY_CREATE, createColonySaga);
  yield takeEvery(TOKEN_CREATE, createTokenSaga);
  // Note that this is `takeLatest` because it runs on user keyboard input
  // and uses the `delay` saga helper.
  yield takeLatest(TOKEN_INFO_FETCH, getTokenInfo);
  yield takeLatest(COLONY_DOMAIN_VALIDATE, validateColonyDomain);
}
