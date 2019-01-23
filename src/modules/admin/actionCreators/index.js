/* @flow */

import type { Address, ENSName } from '~types';

import {
  COLONY_FETCH_TRANSACTIONS,
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
  COLONY_CLAIM_TOKEN,
  COLONY_CLAIM_TOKEN_ERROR,
  COLONY_CLAIM_TOKEN_SUCCESS,
} from '../actionTypes';

import {
  createTxActionCreator,
  COLONY_CONTEXT,
} from '../../core/actionCreators';

export const fetchColonyTransactions = (colonyENSName: ENSName) => ({
  type: COLONY_FETCH_TRANSACTIONS,
  meta: { keyPath: [colonyENSName] },
});

export const fetchColonyUnclaimedTransactions = (colonyENSName: ENSName) => ({
  type: COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
  meta: { keyPath: [colonyENSName] },
});

export const claimColonyToken = (ensName: ENSName, tokenAddress: Address) => ({
  type: COLONY_CLAIM_TOKEN,
  payload: { ensName, tokenAddress },
});

export const claimColonyTokenTransaction = createTxActionCreator<{
  token: string,
}>({
  context: COLONY_CONTEXT,
  methodName: 'claimColonyFunds',
  lifecycle: {
    error: COLONY_CLAIM_TOKEN_ERROR,
    eventDataReceived: COLONY_CLAIM_TOKEN_SUCCESS,
  },
});
