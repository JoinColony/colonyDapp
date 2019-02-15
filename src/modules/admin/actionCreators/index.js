/* @flow */

import type { Address, ENSName } from '~types';

import {
  COLONY_FETCH_TRANSACTIONS,
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
  COLONY_CLAIM_TOKEN,
} from '../actionTypes';

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
