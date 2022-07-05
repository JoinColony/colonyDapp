import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';
import {
  ColonyTransfersDocument,
  ColonyTransfersQueryVariables,
  ColonyTransfersQuery,
  TokenBalancesForDomainsQuery,
  TokenBalancesForDomainsQueryVariables,
  TokenBalancesForDomainsDocument,
} from '~data/index';
import { ContextModule, TEMP_getContext } from '~context/index';

import { createTransaction, getTxChannel } from '../../core/sagas';

function* colonyClaimToken({
  payload: { colonyAddress, tokenAddress },
  meta,
}: Action<ActionTypes.CLAIM_TOKEN>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    txChannel = yield call(getTxChannel, meta.id);
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'claimColonyFunds',
      identifier: colonyAddress,
      params: [tokenAddress],
    });

    const { payload } = yield takeFrom(
      txChannel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    yield put<AllActions>({
      type: ActionTypes.CLAIM_TOKEN_SUCCESS,
      payload,
      meta,
    });

    // Refresh relevant values
    yield apolloClient.query<
      ColonyTransfersQuery,
      ColonyTransfersQueryVariables
    >({
      query: ColonyTransfersDocument,
      variables: { address: colonyAddress },
      fetchPolicy: 'network-only',
    });
    yield apolloClient.query<
      TokenBalancesForDomainsQuery,
      TokenBalancesForDomainsQueryVariables
    >({
      query: TokenBalancesForDomainsDocument,
      variables: { colonyAddress, tokenAddresses: [tokenAddress] },
      fetchPolicy: 'network-only',
    });
  } catch (error) {
    return yield putError(ActionTypes.CLAIM_TOKEN_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
  }
  return null;
}

export default function* colonySagas() {
  yield takeEvery(ActionTypes.CLAIM_TOKEN, colonyClaimToken);
}
