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

    const {
      approveTokensTransaction,
      buyTokensTransaction,
    } = yield createTransactionChannels(metaId, ['buyTokensTransaction']);

    /*
     * If the token is non-ETH/XDAI, then we need to approve the amount we use
     * to purchase with
     */
    if (purchaseTokenAddress !== AddressZero) {
      yield fork(createTransaction, approveTokensTransaction.id, {
        context: ClientType.TokenClient,
        methodName: 'approve',
        identifier: colonyAddress,
        params: [coinMachineClient.address, purchaseCost],
        group: {
          key: batchKey,
          id: metaId,
          index: 0,
        },
        ready: false,
      });
    }

    const buyTokensTransactionConfig: TxConfig = {
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
    };
    /*
     * If the token is non-ETH/XDAI, then we need to approve the amount we use
     * to purchase with
     */
    if (
      purchaseTokenAddress !== AddressZero &&
      buyTokensTransactionConfig?.group
    ) {
      delete buyTokensTransactionConfig.options;
      buyTokensTransactionConfig.group.index = 1;
    }

    yield fork(
      createTransaction,
      buyTokensTransaction.id,
      buyTokensTransactionConfig,
    );

    /*
     * If the token is non-ETH/XDAI, then we need to approve the amount we use
     * to purchase with
     */
    if (purchaseTokenAddress !== AddressZero) {
      yield takeFrom(
        approveTokensTransaction.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield takeFrom(
      buyTokensTransaction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    /*
     * If the token is non-ETH/XDAI, then we need to approve the amount we use
     * to purchase with
     */
    if (purchaseTokenAddress !== AddressZero) {
      yield put(transactionReady(approveTokensTransaction.id));

      yield takeFrom(
        approveTokensTransaction.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

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
