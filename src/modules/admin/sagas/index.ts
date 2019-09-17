import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';

import { AllActions, Action, ActionTypes } from '~redux/index';
import {
  takeFrom,
  putError,
  executeCommand,
  executeQuery,
} from '~utils/saga/effects';
import { ContractContexts } from '~types/index';
// import { Context, getContext } from '~context/index';
// import { decorateLog } from '~utils/web3/eventLogs/events';
// import { normalizeTransactionLog } from '~data/normalizers';
import { getColony } from '../../dashboard/data/queries';
import {
  getColonyTransactions,
  getColonyUnclaimedTransactions,
} from '../data/queries';
import { updateTokenInfo } from '../../dashboard/data/commands';
import { createTransaction, getTxChannel } from '../../core/sagas';
import { transactionReady } from '../../core/actionCreators';
import {
  fetchColonyTransactions,
  fetchColonyUnclaimedTransactions,
} from '../actionCreators';
import { fetchColony } from '../../dashboard/actionCreators';
import { colonyNativeTokenSelector } from '../../dashboard/selectors';

function* colonyTransactionsFetch({
  payload: { colonyAddress },
  meta,
}: Action<ActionTypes.COLONY_TRANSACTIONS_FETCH>) {
  try {
    const transactions = yield executeQuery(getColonyTransactions, {
      args: undefined,
      metadata: {
        colonyAddress,
      },
    });

    yield put<AllActions>({
      type: ActionTypes.COLONY_TRANSACTIONS_FETCH_SUCCESS,
      meta,
      payload: { colonyAddress, transactions },
    });
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_TRANSACTIONS_FETCH_ERROR,
      error,
      meta,
    );
  }
  return null;
}

function* colonyUnclaimedTransactionsFetch({
  payload: { colonyAddress },
  meta,
}: Action<ActionTypes.COLONY_UNCLAIMED_TRANSACTIONS_FETCH>) {
  try {
    const transactions = yield executeQuery(getColonyUnclaimedTransactions, {
      args: undefined,
      metadata: { colonyAddress },
    });

    yield put<Action<ActionTypes.COLONY_UNCLAIMED_TRANSACTIONS_FETCH_SUCCESS>>({
      type: ActionTypes.COLONY_UNCLAIMED_TRANSACTIONS_FETCH_SUCCESS,
      meta,
      payload: { colonyAddress, transactions },
    });
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_UNCLAIMED_TRANSACTIONS_FETCH_ERROR,
      error,
      meta,
    );
  }
  return null;
}

/*
 * Claim tokens, then reload unclaimed transactions list.
 */
function* colonyClaimToken({
  payload: { colonyAddress, tokenAddress },
  meta,
}: Action<ActionTypes.COLONY_CLAIM_TOKEN>) {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, meta.id);
    yield fork(createTransaction, meta.id, {
      context: ContractContexts.COLONY_CONTEXT,
      methodName: 'claimColonyFunds',
      identifier: colonyAddress,
      params: { token: tokenAddress },
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
    yield put<AllActions>(fetchColonyTransactions(colonyAddress));
    yield put<AllActions>(fetchColonyUnclaimedTransactions(colonyAddress));
    yield put<AllActions>({
      type: ActionTypes.COLONY_TOKEN_BALANCE_FETCH,
      payload: { colonyAddress, domainId: 1, tokenAddress },
    });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_CLAIM_TOKEN_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
  }
  return null;
}

function* colonyUpdateTokens({
  payload: { colonyAddress, tokens },
  payload,
  meta,
}: Action<ActionTypes.COLONY_UPDATE_TOKENS>) {
  try {
    /*
     * @todo Consider fetching tokens from state
     * @body Consider fetching tokens from state instead of executing a query before updating colony tokens
     */
    const { tokens: currentTokenReferences = {} } = yield executeQuery(
      getColony,
      {
        args: undefined,
        metadata: { colonyAddress },
      },
    );
    yield executeCommand(updateTokenInfo, {
      metadata: { colonyAddress },
      args: { tokens, currentTokenReferences },
    });
    yield put(fetchColony(colonyAddress));

    // We could consider dispatching an action to fetch tokens when
    // successfully updating them
    yield put({ type: ActionTypes.COLONY_UPDATE_TOKENS_SUCCESS, payload });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_UPDATE_TOKENS_ERROR, error, meta);
  }
  return null;
}

function* colonyMintTokens({
  payload: { amount, colonyAddress },
  meta,
}: Action<ActionTypes.COLONY_MINT_TOKENS>) {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, meta.id);
    const { address: nativeTokenAddress } = yield select(
      colonyNativeTokenSelector,
      colonyAddress,
    );

    // setup batch ids and channels
    const batchKey = 'mintTokens';
    const mintTokens = {
      id: `${meta.id}-mintTokens`,
      channel: yield call(getTxChannel, `${meta.id}-mintTokens`),
    };
    const claimColonyFunds = {
      id: `${meta.id}-claimColonyFunds`,
      channel: yield call(getTxChannel, `${meta.id}-claimColonyFunds`),
    };

    // create transactions
    yield fork(createTransaction, mintTokens.id, {
      context: ContractContexts.COLONY_CONTEXT,
      methodName: 'mintTokens',
      identifier: colonyAddress,
      params: { amount },
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      ready: false,
    });
    yield fork(createTransaction, claimColonyFunds.id, {
      context: ContractContexts.COLONY_CONTEXT,
      methodName: 'claimColonyFunds',
      identifier: colonyAddress,
      params: {
        token: nativeTokenAddress,
      },
      group: {
        key: batchKey,
        id: meta.id,
        index: 1,
      },
      ready: false,
    });

    // wait for txs to be created
    yield takeFrom(mintTokens.channel, ActionTypes.TRANSACTION_CREATED);
    yield takeFrom(claimColonyFunds.channel, ActionTypes.TRANSACTION_CREATED);
    yield put({ type: ActionTypes.COLONY_MINT_TOKENS_SUBMITTED });

    // send txs sequentially
    yield put(transactionReady(mintTokens.id));
    const {
      payload: {
        params: { amount: mintedAmount },
        transaction: { receipt },
      },
    } = yield takeFrom(mintTokens.channel, ActionTypes.TRANSACTION_SUCCEEDED);
    yield put(transactionReady(claimColonyFunds.id));
    yield takeFrom(claimColonyFunds.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    /*
      if we got a Mint event log back (we will have on success) get the
      contract address it's from, and refetch the colony's balance for it
    */
    const mintLog = receipt.logs[0];
    if (mintLog) {
      const tokenAddress = mintLog.address;
      yield all([
        put<AllActions>({
          type: ActionTypes.COLONY_TOKEN_BALANCE_FETCH,
          payload: { colonyAddress, domainId: 0, tokenAddress },
        }),
        put<AllActions>({
          type: ActionTypes.COLONY_TOKEN_BALANCE_FETCH,
          payload: { colonyAddress, domainId: 1, tokenAddress },
        }),
      ]);

      // const colonyManager = yield getContext(Context.COLONY_MANAGER);
      // const tokenClient = yield call(
      //   [colonyManager, colonyManager.getTokenClient],
      //   tokenAddress,
      // );

      /*
       * Notification
       */

      // const decoratedLog = yield call(decorateLog, tokenClient, mintLog);
      // yield putNotification(
      //   normalizeTransactionLog(tokenAddress, decoratedLog),
      // );
    }

    yield put<AllActions>({
      type: ActionTypes.COLONY_MINT_TOKENS_SUCCESS,
      payload: { amount: mintedAmount },
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_MINT_TOKENS_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
  }
  return null;
}

export default function* adminSagas() {
  yield takeEvery(
    ActionTypes.COLONY_TRANSACTIONS_FETCH,
    colonyTransactionsFetch,
  );
  yield takeEvery(
    ActionTypes.COLONY_UNCLAIMED_TRANSACTIONS_FETCH,
    colonyUnclaimedTransactionsFetch,
  );
  yield takeEvery(ActionTypes.COLONY_CLAIM_TOKEN, colonyClaimToken);
  yield takeEvery(ActionTypes.COLONY_UPDATE_TOKENS, colonyUpdateTokens);
  yield takeEvery(ActionTypes.COLONY_MINT_TOKENS, colonyMintTokens);
}
