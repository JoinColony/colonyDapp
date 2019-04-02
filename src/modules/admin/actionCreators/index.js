/* @flow */

import type { Address } from '~types';
import type { Action } from '~redux';

import { ACTIONS } from '~redux';

export const fetchColonyTransactions = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_FETCH_TRANSACTIONS> => ({
  type: ACTIONS.COLONY_FETCH_TRANSACTIONS,
  payload: { colonyAddress },
  meta: { keyPath: [colonyAddress] },
});

export const fetchColonyUnclaimedTransactions = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS> => ({
  type: ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
  payload: { colonyAddress },
  meta: { keyPath: [colonyAddress] },
});

export const claimColonyToken = (
  colonyAddress: Address,
  tokenAddress: Address,
) => ({
  type: ACTIONS.COLONY_CLAIM_TOKEN,
  payload: { colonyAddress, tokenAddress },
});

export const updateColonyTokens = (
  colonyAddress: Address,
  tokens: Address[],
) => ({
  type: ACTIONS.COLONY_UPDATE_TOKENS,
  meta: { keyPath: [colonyAddress] },
  payload: { colonyAddress, tokens },
});
