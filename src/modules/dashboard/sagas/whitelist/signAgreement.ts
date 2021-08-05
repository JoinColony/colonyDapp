import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';
import { AddressZero } from 'ethers/constants';
import moveDecimal from 'move-decimal-point';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { createAddress } from '~utils/web3';
import { ContextModule, TEMP_getContext } from '~context/index';
import { getToken } from '~data/resolvers/token';
import { TxConfig } from '~types/index';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../../../core/sagas';
import { transactionReady } from '../../../core/actionCreators';

function* signAgreement({
  payload: { agreementHash, colonyAddress },
  meta: { id: metaId },
  meta,
}: Action<ActionTypes.WHITELIST_SIGN_AGREEMENT>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    if (!agreementHash) {
      throw new Error('Agreement hash needs to be provided');
    }

    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

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
    txChannel.close();
  }
}

export default function* signAgreementSaga() {
  yield takeEvery(ActionTypes.WHITELIST_SIGN_AGREEMENT, signAgreement);
}
