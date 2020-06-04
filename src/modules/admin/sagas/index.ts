import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { AllActions, Action, ActionTypes } from '~redux/index';
import { takeFrom, putError } from '~utils/saga/effects';
import { ContextModule, TEMP_getContext } from '~context/index';
import {
  ColonyQuery,
  ColonyQueryVariables,
  ColonyDocument,
  TokenBalancesForDomainsQuery,
  TokenBalancesForDomainsQueryVariables,
  TokenBalancesForDomainsDocument,
} from '~data/index';

import { createTransaction, getTxChannel } from '../../core/sagas';
import { transactionReady } from '../../core/actionCreators';

/*
 * Claim tokens, then reload unclaimed transactions list.
 */
function* colonyClaimToken({
  payload: { colonyAddress, tokenAddress },
  meta,
}: Action<ActionTypes.COLONY_CLAIM_TOKEN>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    txChannel = yield call(getTxChannel, meta.id);
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'claimColonyFunds',
      identifier: colonyAddress,
      params: [tokenAddress],
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
    // FIXME refresh Colony transaction queries
    // yield put<AllActions>(fetchColonyTransactions(colonyAddress));
    // yield put<AllActions>(fetchColonyUnclaimedTransactions(colonyAddress));

    yield apolloClient.query<
      TokenBalancesForDomainsQuery,
      TokenBalancesForDomainsQueryVariables
    >({
      query: TokenBalancesForDomainsDocument,
      variables: { colonyAddress, tokenAddresses: [tokenAddress] },
    });
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
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    const { data } = yield apolloClient.query<
      ColonyQuery,
      ColonyQueryVariables
    >({
      query: ColonyDocument,
      variables: { address: colonyAddress },
    });

    if (!data) {
      throw new Error('Could not get Colony tokens');
    }

    const {
      colony: { nativeTokenAddress },
    } = data;
    if (!nativeTokenAddress) {
      throw new Error(`Could not get the Colony's native token`);
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
      context: ClientType.ColonyClient,
      methodName: 'mintTokens',
      identifier: colonyAddress,
      params: [amount],
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      ready: false,
    });
    yield fork(createTransaction, claimColonyFunds.id, {
      context: ClientType.ColonyClient,
      methodName: 'claimColonyFunds',
      identifier: colonyAddress,
      params: [nativeTokenAddress],
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
      yield apolloClient.query<
        TokenBalancesForDomainsQuery,
        TokenBalancesForDomainsQueryVariables
      >({
        query: TokenBalancesForDomainsDocument,
        variables: {
          colonyAddress,
          tokenAddresses: [nativeTokenAddress],
        },
        // Force resolvers to update, as query resolvers are only updated on a cache miss
        // See #4: https://www.apollographql.com/docs/link/links/state/#resolvers
        // Also: https://www.apollographql.com/docs/react/api/react-apollo/#optionsfetchpolicy
        fetchPolicy: 'network-only',
      });
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
  yield takeEvery(ActionTypes.COLONY_CLAIM_TOKEN, colonyClaimToken);
  yield takeEvery(ActionTypes.COLONY_MINT_TOKENS, colonyMintTokens);
}
