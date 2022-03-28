import { call, put, takeEvery, fork } from 'redux-saga/effects';

import { bigNumberify } from 'ethers/utils';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { ExtendedReduxContext } from '~types/index';
import {
  UserBalanceWithLockDocument,
  UserBalanceWithLockQuery,
  UserBalanceWithLockQueryVariables,
  UnwrapTokenForMetacolonyDocument,
  UnwrapTokenForMetacolonyQuery,
  UnwrapTokenForMetacolonyQueryVariables,
} from '~data/index';
import { TEMP_getContext, ContextModule } from '~context/index';
import { putError, takeFrom } from '~utils/saga/effects';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../../../core/sagas';

function* unwrapToken({
  meta,
  payload,
  payload: { amount, userAddress, colonyAddress, unwrappedTokenAddress },
}: Action<ActionTypes.META_UNWRAP_TOKEN>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    yield fork(createTransaction, meta.id, {
      context: ExtendedReduxContext.WrappedToken,
      methodName: 'withdraw',
      identifier: process.env.META_WRAPPED_TOKEN_ADDRESS,
      params: [bigNumberify(amount)],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put<AllActions>({
      type: ActionTypes.META_UNWRAP_TOKEN_SUCCESS,
      payload,
      meta,
    });

    /*
     *  Refresh queries
     */
    yield apolloClient.query<
      UserBalanceWithLockQuery,
      UserBalanceWithLockQueryVariables
    >({
      query: UserBalanceWithLockDocument,
      variables: {
        address: userAddress,
        tokenAddress: unwrappedTokenAddress,
        colonyAddress,
      },
      fetchPolicy: 'network-only',
    });

    yield apolloClient.query<
      UnwrapTokenForMetacolonyQuery,
      UnwrapTokenForMetacolonyQueryVariables
    >({
      query: UnwrapTokenForMetacolonyDocument,
      variables: {
        userAddress,
      },
      fetchPolicy: 'network-only',
    });

    yield waitForTxResult(txChannel);
  } catch (error) {
    return yield putError(ActionTypes.META_UNWRAP_TOKEN_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* unwrapTokenSaga() {
  yield takeEvery(ActionTypes.META_UNWRAP_TOKEN, unwrapToken);
}
