/* @flow */

import type { Saga } from 'redux-saga';

import { providers } from 'ethers';
import ColonyNetworkClient from '@colony/colony-js-client';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import { delay } from 'redux-saga';
import {
  call,
  getContext,
  put,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import { replace } from 'connected-react-router';

import type { Action } from '~types/index';

import { COLONY_HOME_ROUTE } from '~routes';
import { putError } from '~utils/saga/effects';
import { getHashedENSDomainString } from '~utils/ens';

import { DDB } from '../../../lib/database';
import { getNetworkMethod } from '../../core/sagas/utils';

import { colonyStore } from '../stores';

import {
  COLONY_CREATE,
  COLONY_CREATE_LABEL,
  COLONY_CREATE_LABEL_SUCCESS,
  COLONY_DOMAIN_VALIDATE,
  COLONY_DOMAIN_VALIDATE_SUCCESS,
  COLONY_DOMAIN_VALIDATE_ERROR,
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
} from '../actionTypes';

import {
  createColony,
  createToken,
  createColonyLabel,
} from '../actionCreators';

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
async function getTokenClientInfo(contractAddress: string) {
  const provider = new providers.EtherscanProvider();
  const adapter = new EthersAdapter({
    // $FlowFixMe The `ContractLoader` type is currently not exported
    loader: tokenABILoader,
    provider,
    // $FlowFixMe This minimal provider doesn't have all Provider features
    wallet: { provider },
  });

  // $FlowFixMe colonyJS issue, will be fixed in the next release (1.8.2?)
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

function* createColonyLabelSaga({
  payload: {
    colonyId,
    colonyAddress,
    colonyName,
    ensName,
    tokenAddress,
    tokenName,
    tokenSymbol,
    tokenIcon,
  },
}: Action): Saga<void> {
  const ddb: DDB = yield getContext('ddb');
  // TODO: No access controller available yet
  const store = yield call([ddb, ddb.createStore], colonyStore);
  // TODO: we might want to change that later in the colony store. Maybe have a "meta" property?
  yield call([store, store.set], {
    colonyId,
    colonyAddress,
    colonyName,
    tokenAddress,
    tokenName,
    tokenSymbol,
    tokenIcon,
  });
  const action = createColonyLabel(colonyAddress, {
    colonyName: ensName,
    orbitDBPath: store.address.toString(),
  });
  yield put(action);
  // TODO: redirect to newly created colony?
  // yield takeTX('success', action) ?
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

/*
 * Redirect to the colony home for the given (newly-registered) label
 */
function* createColonyLabelSuccessSaga(action: Action): Saga<void> {
  const {
    payload: {
      // FIXME this event data is not available yet (waiting on colonyNetwork#443)
      // so we will need to create a workaround to get the label from this action.
      eventData: { address, label }, // eslint-disable-line
    },
  } = action;
  yield put(replace(COLONY_HOME_ROUTE.replace(':colonyLabel', label)));
}

export default function* colonySagas(): any {
  yield takeEvery(COLONY_CREATE, createColonySaga);
  yield takeEvery(TOKEN_CREATE, createTokenSaga);
  yield takeEvery(TOKEN_ICON_UPLOAD, uploadTokenIcon);
  yield takeEvery(TOKEN_ICON_FETCH, getTokenIcon);
  yield takeEvery(COLONY_CREATE_LABEL, createColonyLabelSaga);
  yield takeEvery(COLONY_CREATE_LABEL_SUCCESS, createColonyLabelSuccessSaga);
  // Note that this is `takeLatest` because it runs on user keyboard input
  // and uses the `delay` saga helper.
  yield takeLatest(TOKEN_INFO_FETCH, getTokenInfo);
  yield takeLatest(COLONY_DOMAIN_VALIDATE, validateColonyDomain);
}
