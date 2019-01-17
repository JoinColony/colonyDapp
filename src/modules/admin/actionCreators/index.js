/* @flow */

import type { SendOptions } from '@colony/colony-js-client';

import type { Address, AddressOrENSName, ENSName } from '~types';

import {
  COLONY_FETCH_TRANSACTIONS,
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
  COLONY_CLAIM_TOKEN,
  COLONY_CLAIM_TOKEN_ERROR,
  COLONY_CLAIM_TOKEN_SUCCESS,
} from '../actionTypes';

import { createColonyTransaction } from '../../core/actionCreators';

export const fetchColonyTransactions = (colonyENSName: ENSName) => ({
  type: COLONY_FETCH_TRANSACTIONS,
  payload: { keyPath: [colonyENSName] },
});

export const fetchColonyUnclaimedTransactions = (colonyENSName: ENSName) => ({
  type: COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
  payload: { keyPath: [colonyENSName] },
});

export const claimColonyToken = (ensName: ENSName, tokenAddress: Address) => ({
  type: COLONY_CLAIM_TOKEN,
  payload: { ensName, tokenAddress },
});

export const claimColonyTokenTransaction = (
  identifier: AddressOrENSName,
  params: { token: string },
  options?: SendOptions,
) =>
  createColonyTransaction({
    params,
    options,
    methodName: 'claimColonyFunds',
    identifier,
    lifecycle: {
      error: COLONY_CLAIM_TOKEN_ERROR,
      eventDataReceived: COLONY_CLAIM_TOKEN_SUCCESS,
    },
  });
