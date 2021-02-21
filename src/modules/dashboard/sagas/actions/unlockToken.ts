import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  ProcessedColonyQuery,
  ProcessedColonyQueryVariables,
  ProcessedColonyDocument,
} from '~data/index';
import { Action, ActionTypes } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';
import { createTransaction, getTxChannel } from '../../../core/sagas';

function* colonyTokenUnlock({
  meta,
  payload: { colonyAddress },
}: Action<ActionTypes.COLONY_ACTION_UNLOCK_TOKEN>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'unlockToken',
      identifier: colonyAddress,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put({
      type: ActionTypes.COLONY_ACTION_UNLOCK_TOKEN_SUCCESS,
      meta,
    });

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
      ActionTypes.COLONY_ACTION_UNLOCK_TOKEN_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* unlockTokenActionSaga() {
  yield takeEvery(ActionTypes.COLONY_ACTION_UNLOCK_TOKEN, colonyTokenUnlock);
}
