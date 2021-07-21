import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux/index';
import {
  WhitelistedUsersDocument,
  WhitelistedUsersQuery,
  WhitelistedUsersQueryVariables,
} from '~data/index';
import { ContextModule, TEMP_getContext } from '~context/index';
import { putError, takeFrom } from '~utils/saga/effects';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../../../core/sagas';

export function* updateWhitelist({
  meta,
  payload: { userAddresses, colonyAddress, status },
}: Action<ActionTypes.WHITELIST_UPDATE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
  // @TODO Please extend this saga to fit batch update when adding addresses to the list
  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.WhitelistClient,
      methodName: 'approveUsers',
      identifier: colonyAddress,
      params: [userAddresses, status],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put<AllActions>({
      type: ActionTypes.WHITELIST_UPDATE_SUCCESS,
      payload: {},
      meta,
    });

    yield waitForTxResult(txChannel);
  } catch (error) {
    return yield putError(ActionTypes.WHITELIST_UPDATE_ERROR, error, meta);
  } finally {
    yield apolloClient.query<
      WhitelistedUsersQuery,
      WhitelistedUsersQueryVariables
    >({
      query: WhitelistedUsersDocument,
      variables: {
        colonyAddress,
      },
      fetchPolicy: 'network-only',
    });
    txChannel.close();
  }
  return null;
}

export default function* updateWhitelistSaga() {
  yield takeEvery(ActionTypes.WHITELIST_UPDATE, updateWhitelist);
}
