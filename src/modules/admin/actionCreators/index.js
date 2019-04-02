/* @flow */

import type { Address, ENSName } from '~types';

import { ACTIONS } from '~redux';

export const fetchColonyTransactions = (colonyName: ENSName) => ({
  type: ACTIONS.COLONY_FETCH_TRANSACTIONS,
  meta: { keyPath: [colonyName] },
});

export const fetchColonyUnclaimedTransactions = (colonyName: ENSName) => ({
  type: ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
  meta: { keyPath: [colonyName] },
});

export const claimColonyToken = (
  colonyName: ENSName,
  tokenAddress: Address,
) => ({
  type: ACTIONS.COLONY_CLAIM_TOKEN,
  payload: { colonyName, tokenAddress },
});

export const updateColonyTokens = (
  colonyENSName: ENSName,
  tokens: Address[],
) => ({
  type: ACTIONS.COLONY_UPDATE_TOKENS,
  meta: { keyPath: [colonyENSName] },
  payload: { tokens },
});
