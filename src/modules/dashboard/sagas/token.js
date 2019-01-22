/* @flow */

import type { Saga } from 'redux-saga';

import ColonyNetworkClient from '@colony/colony-js-client';
import TokenClient from '@colony/colony-js-client/lib/TokenClient';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import {
  call,
  delay,
  getContext,
  put,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';

import type { Action } from '~types';

import { putError } from '~utils/saga/effects';

import {
  TOKEN_CREATE,
  TOKEN_INFO_FETCH,
  TOKEN_INFO_FETCH_ERROR,
  TOKEN_INFO_FETCH_SUCCESS,
  TOKEN_ICON_UPLOAD,
  TOKEN_ICON_UPLOAD_ERROR,
  TOKEN_ICON_UPLOAD_SUCCESS,
  TOKEN_ICON_FETCH,
  TOKEN_ICON_FETCH_ERROR,
  TOKEN_ICON_FETCH_SUCCESS,
} from '../actionTypes/token';

import { createToken } from '../actionCreators';

// A minimal version of the `Token.sol` ABI, with only `name`, `symbol` and
// `decimals` entries included.
import TokenABI from './TokenABI.json';

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
async function getTokenClientInfo(
  contractAddress: string,
  networkClient: ColonyNetworkClient,
) {
  const adapter = new EthersAdapter({
    // $FlowFixMe The `ContractLoader` type is currently not exported
    loader: tokenABILoader,
    provider: networkClient.adapter.provider,
    wallet: networkClient.adapter.wallet,
  });

  const client = new TokenClient({
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

  yield delay(1000);

  let info;
  try {
    // Attempt to get the token info from a new `TokenClient` instance.
    const { networkClient } = yield getContext('colonyManager');
    info = yield call(getTokenClientInfo, tokenAddress, networkClient);
  } catch (error) {
    yield putError(TOKEN_INFO_FETCH_ERROR, error);
    return;
  }
  yield put({ type: TOKEN_INFO_FETCH_SUCCESS, payload: info });
}

/*
 * Forward on the renamed form params to create a transaction.
 */
function* createTokenSaga({
  payload: { tokenName: name, tokenSymbol: symbol },
  meta,
}: *): Saga<void> {
  yield put(createToken({ params: { name, symbol }, meta }));
}

/**
 * Upload a token icon to IPFS.
 */
function* uploadTokenIcon(action: Action): Saga<void> {
  const { data } = action.payload;
  const ipfsNode = yield getContext('ipfsNode');

  try {
    const hash = yield call([ipfsNode, ipfsNode.addString], data);

    yield put({
      type: TOKEN_ICON_UPLOAD_SUCCESS,
      payload: { hash },
    });
  } catch (error) {
    yield putError(TOKEN_ICON_UPLOAD_ERROR, error);
  }
}

/**
 * Get the token icon with given IPFS hash.
 */
function* getTokenIcon(action: Action): Saga<void> {
  const { hash } = action.payload;
  const ipfsNode = yield getContext('ipfsNode');

  try {
    const iconData = yield call([ipfsNode, ipfsNode.getString], hash);
    // TODO: this should be put in the redux store by a reducer
    yield put({
      type: TOKEN_ICON_FETCH_SUCCESS,
      payload: { hash, iconData },
    });
  } catch (error) {
    yield putError(TOKEN_ICON_FETCH_ERROR, error);
  }
}

export default function* tokenSagas(): any {
  yield takeEvery(TOKEN_CREATE, createTokenSaga);
  yield takeEvery(TOKEN_ICON_UPLOAD, uploadTokenIcon);
  yield takeEvery(TOKEN_ICON_FETCH, getTokenIcon);
  // Note that this is `takeLatest` because it runs on user keyboard input
  // and uses the `delay` saga helper.
  yield takeLatest(TOKEN_INFO_FETCH, getTokenInfo);
}
