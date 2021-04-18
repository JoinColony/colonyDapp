import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../../../core/sagas';
import { transactionReady } from '../../../core/actionCreators';

function* buyTokens({
  payload: { colonyAddress, amount, decimals },
  meta: { id: metaId },
  meta,
}: Action<ActionTypes.COIN_MACHINE_BUY_TOKENS>) {
  let txChannel;
  try {
    if (!amount) {
      throw new Error('Amount is needed to buy token in the sale');
    }

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'buyTokens';

    const { buyTokensTransaction } = yield createTransactionChannels(metaId, [
      'buyTokensTransaction',
    ]);

    /*
     * @TODO Add actual buy tokens contract call
     */
    yield fork(createTransaction, buyTokensTransaction.id, {
      context: ClientType.CoinMachineClient,
      methodName: 'buyTokens',
      identifier: colonyAddress,
      params: [bigNumberify(amount).mul(bigNumberify(10).pow(decimals))],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    yield takeFrom(
      buyTokensTransaction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    yield put(transactionReady(buyTokensTransaction.id));

    yield takeFrom(
      buyTokensTransaction.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    yield put<AllActions>({
      type: ActionTypes.COIN_MACHINE_BUY_TOKENS_SUCCESS,
      meta,
    });
  } catch (caughtError) {
    putError(ActionTypes.COIN_MACHINE_BUY_TOKENS_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* mintTokensActionSaga() {
  yield takeEvery(ActionTypes.COIN_MACHINE_BUY_TOKENS, buyTokens);
}
