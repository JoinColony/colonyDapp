/* @flow */

import type { Saga } from 'redux-saga';

import BigNumber from 'bn.js';
import { call, getContext, put, takeEvery } from 'redux-saga/effects';

import type { Action } from '~types';
import type { ContractTransactionProps } from '~immutable';

import { putError, callCaller, raceError } from '~utils/saga/effects';

import {
  fetchColonyTransactions,
  fetchColonyUnclaimedTransactions,
  claimColonyTokenTransaction,
} from '../actionCreators';
import {
  COLONY_FETCH_TRANSACTIONS_ERROR,
  COLONY_FETCH_TRANSACTIONS_SUCCESS,
  COLONY_FETCH_TRANSACTIONS,
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS_ERROR,
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS_SUCCESS,
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
  COLONY_CLAIM_TOKEN_ERROR,
  COLONY_CLAIM_TOKEN_SUCCESS,
  COLONY_CLAIM_TOKEN,
} from '../actionTypes';

function* fetchColonyTransactionsSaga(action: Action): Saga<void> {
  const { key: colonyENSName } = action.payload;
  const colonyManager = yield getContext('colonyManager');

  try {
    const colonyClient = yield call(
      [colonyManager, colonyManager.getColonyClient],
      colonyENSName,
    );
    const { provider } = colonyClient.adapter;

    const filter = {
      address: colonyClient.contract.address,
      fromBlock: 0, // TODO: set this properly
      toBlock: 'latest',
      eventNames: [
        'ColonyFundsClaimed',
        'ColonyFundsMovedBetweenFundingPots',
        'TaskPayoutClaimed',
      ],
    };

    const logs = yield call([colonyClient, colonyClient.getLogs], filter);
    const events = yield call([colonyClient, colonyClient.parseLogs], logs);

    const transactions: Array<ContractTransactionProps> = [];
    for (let i = 0; i < events.length; i += 1) {
      const { eventName } = events[i];
      const { transactionHash, blockHash } = logs[i];
      const { timestamp } = yield call(
        [provider, provider.getBlock],
        blockHash,
      );
      const date = new Date(timestamp);
      if (eventName === 'ColonyFundsClaimed') {
        const { payoutRemainder: amount, token } = events[i];
        const { from } = yield call(
          [provider, provider.getTransaction],
          transactionHash,
        );
        // don't show claims of zero
        if (amount.gt(new BigNumber(0))) {
          transactions.push({
            amount,
            colonyENSName,
            date,
            from,
            id: transactionHash,
            incoming: true,
            token,
            hash: transactionHash,
          });
        }
      } else if (eventName === 'ColonyFundsMovedBetweenFundingPots') {
        const { amount, fromPot, token } = events[i];
        // TODO: replace this once able to get taskId from potId
        const taskId = 1;
        // const [, taskId] = yield call(
        //   [colonyClient.contract, colonyClient.contract.pots],
        //   events[i].fromPot === 1 ? events[i].toPot : events[i].fromPot,
        // );
        transactions.push({
          amount,
          colonyENSName,
          date,
          id: transactionHash,
          incoming: fromPot !== 1,
          taskId,
          token,
          hash: transactionHash,
        });
      } else if (eventName === 'TaskPayoutClaimed') {
        const { taskId, role, amount, token } = events[i];
        const { address: to } = yield callCaller({
          colonyENSName,
          methodName: 'getTaskRole',
          params: { taskId, role },
        });
        transactions.push({
          amount,
          date,
          id: transactionHash,
          incoming: false,
          taskId,
          to,
          token,
          hash: transactionHash,
        });
      }
    }

    yield put({
      type: COLONY_FETCH_TRANSACTIONS_SUCCESS,
      payload: { transactions, key: colonyENSName },
    });
  } catch (error) {
    yield putError(COLONY_FETCH_TRANSACTIONS_ERROR, error);
  }
}

function* fetchColonyUnclaimedTransactionsSaga(action: Action): Saga<void> {
  const { key: colonyENSName } = action.payload;
  const colonyManager = yield getContext('colonyManager');

  try {
    const colonyClient = yield call(
      [colonyManager, colonyManager.getColonyClient],
      colonyENSName,
    );
    const { provider } = colonyClient.adapter;

    const currentBlock = yield call([provider, provider.getBlockNumber]);
    const blocksBack = 400000;
    const fromBlock =
      currentBlock - blocksBack < 0 ? 0 : currentBlock - blocksBack;
    const toBlock = 'latest';

    // Get logs + events for token Transfer to this Colony
    const transferLogs = yield call(
      [colonyClient.token, colonyClient.token.getLogs],
      {
        fromBlock,
        toBlock,
        eventNames: ['Transfer'],
        // [eventNames, from, to]
        topics: [
          [],
          undefined,
          [
            `0x000000000000000000000000${colonyClient.contract.address
              .slice(2)
              .toLowerCase()}`,
          ],
        ],
      },
    );
    const transferEvents = yield call(
      [colonyClient.token, colonyClient.token.parseLogs],
      transferLogs,
    );

    // Get logs + events for token claims by this Colony
    const claimLogs = yield call([colonyClient, colonyClient.getLogs], {
      address: colonyClient.contract.address,
      fromBlock,
      toBlock,
      eventNames: ['ColonyFundsClaimed'],
    });
    const claimEvents = yield call(
      [colonyClient, colonyClient.parseLogs],
      claimLogs,
    );

    const transactions: Array<ContractTransactionProps> = [];
    for (let i = 0; i < transferEvents.length; i += 1) {
      const { from, tokens: amount } = transferEvents[i];
      const {
        address: token,
        blockHash,
        blockNumber,
        transactionHash: hash,
      } = transferLogs[i];
      const { timestamp } = yield call(
        [provider, provider.getBlock],
        blockHash,
      );
      const date = new Date(timestamp);

      // Only add to the list if we haven't claimed since it happened
      if (
        !claimEvents.find(
          (event, j) =>
            event.token.toLowerCase() === token.toLowerCase() &&
            claimLogs[j].blockNumber > blockNumber,
        )
      ) {
        transactions.push({
          amount,
          colonyENSName,
          date,
          from,
          hash,
          id: hash,
          incoming: true,
          token,
        });
      }
    }

    yield put({
      type: COLONY_FETCH_UNCLAIMED_TRANSACTIONS_SUCCESS,
      payload: { transactions, key: colonyENSName },
    });
  } catch (error) {
    yield putError(COLONY_FETCH_UNCLAIMED_TRANSACTIONS_ERROR, error);
  }
}

/**
 * Claim tokens, then reload unclaimed transactions list.
 */
function* claimColonyToken(action: Action): Saga<void> {
  const { ensName, tokenAddress: token } = action.payload;

  try {
    yield put(claimColonyTokenTransaction(ensName, { token }));
    yield raceError(COLONY_CLAIM_TOKEN_SUCCESS, COLONY_CLAIM_TOKEN_ERROR);
    yield put(fetchColonyTransactions(ensName));
    yield put(fetchColonyUnclaimedTransactions(ensName));
  } catch (error) {
    yield putError(COLONY_CLAIM_TOKEN_ERROR, error);
  }
}

export default function* colonySagas(): any {
  yield takeEvery(COLONY_FETCH_TRANSACTIONS, fetchColonyTransactionsSaga);
  yield takeEvery(
    COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
    fetchColonyUnclaimedTransactionsSaga,
  );
  yield takeEvery(COLONY_CLAIM_TOKEN, claimColonyToken);
}
