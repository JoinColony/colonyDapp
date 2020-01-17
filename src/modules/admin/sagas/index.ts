import ApolloClient from 'apollo-client';
import { call, fork, getContext, put, takeEvery } from 'redux-saga/effects';
import BigNumber from 'bn.js';

import { ZERO_ADDRESS } from '~utils/web3/constants';
import { AllActions, Action, ActionTypes } from '~redux/index';
import { takeFrom, putError } from '~utils/saga/effects';
import { ColonyClient, ColonyManager, ContractContexts } from '~types/index';
import { Context } from '~context/index';
import {
  ColonyQuery,
  ColonyQueryVariables,
  ColonyDocument,
  TokenBalancesForDomainsQuery,
  TokenBalancesForDomainsQueryVariables,
  TokenBalancesForDomainsDocument,
} from '~data/index';
import {
  getLogsAndEvents,
  parseColonyFundsClaimedEvent,
  parseColonyFundsMovedBetweenFundingPotsEvent,
  parsePayoutClaimedEvent,
  parseUnclaimedTransferEvent,
} from '~utils/web3/eventLogs';
import { ContractTransactionType } from '~immutable/index';

import { createTransaction, getTxChannel } from '../../core/sagas';
import { transactionReady } from '../../core/actionCreators';
import {
  fetchColonyTransactions,
  fetchColonyUnclaimedTransactions,
} from '../actionCreators';

const EVENT_PARSERS = {
  ColonyFundsClaimed: parseColonyFundsClaimedEvent,
  // eslint-disable-next-line max-len
  ColonyFundsMovedBetweenFundingPots: parseColonyFundsMovedBetweenFundingPotsEvent,
  PayoutClaimed: parsePayoutClaimedEvent,
};

function* colonyTransactionsFetch({
  payload: { colonyAddress },
  meta,
}: Action<ActionTypes.COLONY_TRANSACTIONS_FETCH>) {
  try {
    const colonyManager: ColonyManager = yield getContext(
      Context.COLONY_MANAGER,
    );
    const colonyClient: ColonyClient = yield colonyManager.getColonyClient(
      colonyAddress,
    );
    const {
      events: {
        ColonyFundsClaimed,
        // ColonyFundsMovedBetweenFundingPots,
        PayoutClaimed,
      },
    } = colonyClient;
    const { events, logs } = yield getLogsAndEvents(
      colonyClient,
      {
        address: colonyAddress,
        fromBlock: 1,
      },
      {
        events: [
          ColonyFundsClaimed,
          /*
        @todo Refactor Colony transactions
        @body The Colony transactions list is currently really just
        events, vaguely displayed as transactions. It should be refactored
        along with the user wallet transactions list.
       */
          // ColonyFundsMovedBetweenFundingPots,
          PayoutClaimed,
        ],
      },
    );
    const transactions = yield Promise.all(
      events.map((event, i) =>
        EVENT_PARSERS[event.eventName]({
          event,
          log: logs[i],
          colonyClient,
          colonyAddress,
        }),
      ),
    );

    yield put<AllActions>({
      type: ActionTypes.COLONY_TRANSACTIONS_FETCH_SUCCESS,
      meta,
      payload: { colonyAddress, transactions: transactions.filter(Boolean) },
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
    const colonyManager: ColonyManager = yield getContext(
      Context.COLONY_MANAGER,
    );
    const colonyClient: ColonyClient = yield colonyManager.getColonyClient(
      colonyAddress,
    );
    const {
      events: { ColonyFundsClaimed },
      tokenClient,
    } = colonyClient;
    const {
      events: { Transfer },
    } = tokenClient;

    // Get logs & events for token transfer to this colony
    const {
      logs: transferLogs,
      events: transferEvents,
    } = yield getLogsAndEvents(
      tokenClient,
      { fromBlock: 1 },
      { events: [Transfer], to: colonyAddress },
    );

    // Get logs & events for token claims by this colony
    const { logs: claimLogs, events: claimEvents } = yield getLogsAndEvents(
      colonyClient,
      { address: colonyAddress, fromBlock: 1 },
      { events: [ColonyFundsClaimed] },
    );

    const unclaimedTransfers = yield Promise.all(
      transferEvents.map((transferEvent, i) =>
        parseUnclaimedTransferEvent({
          claimEvents,
          claimLogs,
          colonyClient,
          colonyAddress,
          transferEvent,
          transferLog: transferLogs[i],
        }),
      ),
    );

    // Get ether balance and add a fake transaction if there's any unclaimed
    const colonyEtherBalance = yield colonyClient.adapter.provider.getBalance(
      colonyAddress,
    );
    const {
      total: colonyNonRewardsPotsTotal,
    } = yield colonyClient.getNonRewardPotsTotal.call({ token: ZERO_ADDRESS });
    const {
      balance: colonyRewardsPotTotal,
    } = yield colonyClient.getFundingPotBalance.call({
      potId: 0,
      token: ZERO_ADDRESS,
    });
    const unclaimedEther = new BigNumber(
      colonyEtherBalance
        .sub(colonyNonRewardsPotsTotal)
        .sub(colonyRewardsPotTotal)
        .toString(10),
    );
    if (unclaimedEther.gtn(0)) {
      unclaimedTransfers.push({
        amount: unclaimedEther,
        colonyAddress,
        date: new Date(),
        hash: '0x0',
        incoming: true,
        token: ZERO_ADDRESS,
      });
    }

    const transactions = unclaimedTransfers.filter(
      Boolean,
    ) as ContractTransactionType[];

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
    const apolloClient: ApolloClient<object> = yield getContext(
      Context.APOLLO_CLIENT,
    );

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
    const apolloClient: ApolloClient<object> = yield getContext(
      Context.APOLLO_CLIENT,
    );
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
