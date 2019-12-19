import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { Action, ActionTypes } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';
import { ContractContexts } from '~types/index';

import { createTransaction, getTxChannel } from '../../core/sagas';

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
}
