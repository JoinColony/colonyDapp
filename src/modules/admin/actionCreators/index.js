/* @flow */

import type { Address, ENSName } from '~types';

import { ACTIONS } from '~redux';

export const fetchColonyTransactions = (colonyENSName: ENSName) => ({
  type: ACTIONS.COLONY_FETCH_TRANSACTIONS,
  meta: { keyPath: [colonyENSName] },
  payload: {},
});

export const fetchColonyUnclaimedTransactions = (colonyENSName: ENSName) => ({
  type: ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
  meta: { keyPath: [colonyENSName] },
  payload: {},
});

export const claimColonyToken = (ensName: ENSName, tokenAddress: Address) => ({
  type: ACTIONS.COLONY_CLAIM_TOKEN,
  meta: {},
  payload: { ensName, tokenAddress },
});
