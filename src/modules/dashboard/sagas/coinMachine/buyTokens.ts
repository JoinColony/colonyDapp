import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';
import moveDecimal from 'move-decimal-point';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { createAddress } from '~utils/web3';
import { ContextModule, TEMP_getContext } from '~context/index';
import { getToken } from '~data/resolvers/token';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../../../core/sagas';
import { transactionReady } from '../../../core/actionCreators';

function* buyTokens({
  payload: { colonyAddress, amount },
  meta: { id: metaId },
  meta,
}: Action<ActionTypes.COIN_MACHINE_BUY_TOKENS>) {
  let txChannel;
  try {
    if (!amount) {
      throw new Error('Amount is needed to buy token in the sale');
    }

    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    const coinMachineClient = yield colonyManager.getClient(
      ClientType.CoinMachineClient,
      colonyAddress,
    );

    const sellableTokenAddress = createAddress(
      yield coinMachineClient.getToken(),
    );
    const purchaseTokenAddress = createAddress(
      yield coinMachineClient.getPurchaseToken(),
    );

    const sellableToken = yield getToken(
      { colonyManager, client: apolloClient },
      sellableTokenAddress,
    );
    const purchaseToken = yield getToken(
      { colonyManager, client: apolloClient },
      purchaseTokenAddress,
    );

    const currentPrice = yield coinMachineClient.getCurrentPrice();

    const purchaseAmount = bigNumberify(
      moveDecimal(amount, getTokenDecimalsWithFallback(sellableToken.decimals)),
    );
    const purchaseCost = purchaseAmount
      .mul(currentPrice)
      .div(bigNumberify(10).pow(purchaseToken.decimals));

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
      params: [purchaseAmount],
      options: {
        value: purchaseCost,
      },
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
