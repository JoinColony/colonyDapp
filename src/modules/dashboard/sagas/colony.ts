import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';
import {
  ProcessedColonyDocument,
  ProcessedColonyQuery,
  ProcessedColonyQueryVariables,
  ColonyTransfersDocument,
  ColonyTransfersQueryVariables,
  ColonyTransfersQuery,
  TokenBalancesForDomainsQuery,
  TokenBalancesForDomainsQueryVariables,
  TokenBalancesForDomainsDocument,
} from '~data/index';
import { ContextModule, TEMP_getContext } from '~context/index';

import { createTransaction, getTxChannel } from '../../core/sagas';

function* colonyRecoveryModeEnter({
  payload: { colonyAddress },
  meta,
}: Action<ActionTypes.COLONY_RECOVERY_MODE_ENTER>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'enterRecoveryMode',
      identifier: colonyAddress,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put({
      type: ActionTypes.COLONY_RECOVERY_MODE_ENTER_SUCCESS,
      meta,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    yield apolloClient.query<
      ProcessedColonyQuery,
      ProcessedColonyQueryVariables
    >({
      query: ProcessedColonyDocument,
      variables: {
        address: colonyAddress,
      },
      fetchPolicy: 'network-only',
    });
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_RECOVERY_MODE_ENTER_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

function* colonyClaimToken({
  payload: { colonyAddress, tokenAddress },
  meta,
}: Action<ActionTypes.COLONY_CLAIM_TOKEN>) {
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
      type: ActionTypes.COLONY_CLAIM_TOKEN_SUCCESS,
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
    return yield putError(ActionTypes.COLONY_CLAIM_TOKEN_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
  }
  return null;
}

export default function* colonySagas() {
  yield takeEvery(
    ActionTypes.COLONY_RECOVERY_MODE_ENTER,
    colonyRecoveryModeEnter,
  );
  yield takeEvery(ActionTypes.COLONY_CLAIM_TOKEN, colonyClaimToken);
}
