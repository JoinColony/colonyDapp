import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { Action, ActionTypes } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';
import {
  ProcessedColonyDocument,
  ProcessedColonyQuery,
  ProcessedColonyQueryVariables,
} from '~data/index';
import { ContextModule, TEMP_getContext } from '~context/index';

import { createTransaction, getTxChannel } from '../../../core/sagas';

function* enterRecoveryAction({
  payload: { colonyAddress, colonyName },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.COLONY_ACTION_RECOVERY>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'enterRecoveryMode',
      identifier: colonyAddress,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put({
      type: ActionTypes.COLONY_ACTION_RECOVERY_SUCCESS,
      meta,
    });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(txChannel, ActionTypes.TRANSACTION_HASH_RECEIVED);
    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

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

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_ACTION_RECOVERY_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* enterRecoveryActionSaga() {
  yield takeEvery(ActionTypes.COLONY_ACTION_RECOVERY, enterRecoveryAction);
}
