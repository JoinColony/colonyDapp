import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { Action, ActionTypes } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';
import { ContextModule, TEMP_getContext } from '~context/index';
import {
  UserWhitelistStatusQuery,
  UserWhitelistStatusDocument,
  UserWhitelistStatusQueryVariables,
} from '~data/index';
import { createTransaction, getTxChannel } from '../../../core/sagas';

function* signAgreement({
  payload: { agreementHash, colonyAddress, userAddress },
  meta,
}: Action<ActionTypes.WHITELIST_SIGN_AGREEMENT>) {
  const txChannel = yield call(getTxChannel, meta.id);
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

  try {
    if (!agreementHash) {
      throw new Error('Agreement hash needs to be provided');
    }

    yield fork(createTransaction, meta.id, {
      context: ClientType.WhitelistClient,
      methodName: 'signAgreement',
      params: [agreementHash],
      identifier: colonyAddress,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put({
      type: ActionTypes.WHITELIST_SIGN_AGREEMENT_SUCCESS,
      meta,
    });
  } catch (caughtError) {
    putError(ActionTypes.WHITELIST_SIGN_AGREEMENT_ERROR, caughtError, meta);
  } finally {
    yield apolloClient.query<
      UserWhitelistStatusQuery,
      UserWhitelistStatusQueryVariables
    >({
      query: UserWhitelistStatusDocument,
      variables: {
        colonyAddress,
        userAddress,
      },
      fetchPolicy: 'network-only',
    });
    txChannel.close();
  }
}

export default function* signAgreementSaga() {
  yield takeEvery(ActionTypes.WHITELIST_SIGN_AGREEMENT, signAgreement);
}
