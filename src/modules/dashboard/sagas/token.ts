import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { getTokenDetails } from '~utils/external';
import { putError, takeFrom } from '~utils/saga/effects';
import { ContractContexts } from '~types/index';

import { ZERO_ADDRESS, ETHER_INFO } from '~utils/web3/constants';
import { Context, getContext } from '~context/index';
import { createTransaction, getTxChannel } from '../../core/sagas';

/**
 * Get the token info for a given `tokenAddress`.
 */
function* tokenInfoFetch({
  payload: { tokenAddress },
  meta,
}: Action<ActionTypes.TOKEN_INFO_FETCH>) {
  // if trying to fetch info for Ether, return hardcoded
  if (tokenAddress === ZERO_ADDRESS) {
    return yield put<AllActions>({
      type: ActionTypes.TOKEN_INFO_FETCH_SUCCESS,
      payload: {
        isVerified: true,
        ...ETHER_INFO,
      },
      meta,
    });
  }

  try {
    /**
     * Given a token contract address, create a `TokenClient` with the minimal
     * token ABI loader and get the token info. The promise will be rejected if
     * the functions do not exist on the contract.
     */
    const colonyManager = yield getContext(Context.COLONY_MANAGER);
    const client = yield call(
      [colonyManager, colonyManager.getTokenClient],
      tokenAddress,
    );
    const tokenInfo = yield call([
      client.getTokenInfo,
      client.getTokenInfo.call,
    ]);
    const tokenDetails = yield call(getTokenDetails, tokenAddress);
    const tokenData = {
      name: tokenInfo.name || tokenDetails.name,
      decimals: tokenInfo.decimals || tokenDetails.decimals,
      symbol: tokenInfo.symbol || tokenDetails.symbol,
      isVerified: tokenDetails.isVerified || false,
    };
    yield put<AllActions>({
      type: ActionTypes.TOKEN_INFO_FETCH_SUCCESS,
      payload: { ...tokenData, tokenAddress },
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.TOKEN_INFO_FETCH_ERROR, error, meta);
  }
  return null;
}

function* tokenCreate({
  payload: { tokenName: name, tokenSymbol: symbol },
  meta,
}: Action<ActionTypes.TOKEN_CREATE>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ContractContexts.NETWORK_CONTEXT,
      methodName: 'createToken',
      params: { name, symbol },
    });
    // These are just temporary for now until we have the new onboarding workflow Normally these are done by the user
    yield put({
      type: ActionTypes.TRANSACTION_ESTIMATE_GAS,
      meta,
    });
    yield takeFrom(txChannel, ActionTypes.TRANSACTION_GAS_UPDATE);
    yield put({
      type: ActionTypes.TRANSACTION_SEND,
      meta,
    });

    const { payload } = yield takeFrom(
      txChannel,
      ActionTypes.TRANSACTION_RECEIPT_RECEIVED,
    );
    yield put({
      type: ActionTypes.TOKEN_CREATE_SUCCESS,
      payload,
      meta,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);
  } catch (error) {
    return yield putError(ActionTypes.TOKEN_CREATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* tokenSagas() {
  yield takeEvery(ActionTypes.TOKEN_CREATE, tokenCreate);
  // Note that this is `takeLatest` because it runs on user keyboard input
  // and uses the `delay` saga helper.
  yield takeEvery(ActionTypes.TOKEN_INFO_FETCH, tokenInfoFetch);
}
