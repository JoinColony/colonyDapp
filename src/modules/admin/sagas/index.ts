import ApolloClient from 'apollo-client';
import { call, fork, getContext, put, takeEvery } from 'redux-saga/effects';

import { AllActions, Action, ActionTypes } from '~redux/index';
import { takeFrom, putError, executeQuery } from '~utils/saga/effects';
import { ContractContexts } from '~types/index';
import { Context } from '~context/index';
import { ColonyTokensDocument } from '~data/index';
// import { Context, getContext } from '~context/index';
// import { decorateLog } from '~utils/web3/eventLogs/events';
// import { normalizeTransactionLog } from '~data/normalizers';
import {
  getColonyTransactions,
  getColonyUnclaimedTransactions,
} from '../data/queries';
import { createTransaction, getTxChannel } from '../../core/sagas';
import { transactionReady } from '../../core/actionCreators';
import {
  fetchColonyTransactions,
  fetchColonyUnclaimedTransactions,
} from '../actionCreators';

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
    // FIXME refresh token balance for colonyAddress, domainId, tokenAddress
    // yield put<AllActions>({
    //   type: ActionTypes.COLONY_TOKEN_BALANCE_FETCH,
    //   payload: { colonyAddress, domainId: ROOT_DOMAIN, tokenAddress },
    // });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_CLAIM_TOKEN_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
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
    const apolloClient: ApolloClient<any> = yield getContext(
      Context.APOLLO_CLIENT,
    );
    const { data } = yield apolloClient.query({ query: ColonyTokensDocument });

    if (!data) {
      throw new Error('Could not get Colony tokens');
    }

    const {
      colony: { tokens },
    } = data;
    const nativeToken = tokens.find(({ isNative }) => isNative);

    if (!nativeToken) {
      throw new Error('Could not get the Colonys native token');
    }

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
        token: nativeToken.address,
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
      // FIXME fetch token balances for these domains and tokens
      // const tokenAddress = mintLog.address;
      // yield all([
      //   put<AllActions>({
      //     type: ActionTypes.COLONY_TOKEN_BALANCE_FETCH,
      //     payload: {
      //       colonyAddress,
      //       domainId: COLONY_TOTAL_BALANCE_DOMAIN_ID,
      //       tokenAddress,
      //     },
      //   }),
      //   put<AllActions>({
      //     type: ActionTypes.COLONY_TOKEN_BALANCE_FETCH,
      //     payload: { colonyAddress, domainId: ROOT_DOMAIN, tokenAddress },
      //   }),
      // ]);
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
  yield takeEvery(ActionTypes.COLONY_MINT_TOKENS, colonyMintTokens);
}
