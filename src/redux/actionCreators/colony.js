/* @flow */

import type { ENSName } from '~types';

import { ACTIONS } from '~redux';

import {
  NETWORK_CONTEXT,
  COLONY_CONTEXT,
} from '../../lib/ColonyManager/constants';
import { createTxActionCreator } from './transactions';

export const createColony = createTxActionCreator<{
  tokenAddress: string,
}>({
  context: NETWORK_CONTEXT,
  methodName: 'createColony',
  lifecycle: {
    error: ACTIONS.COLONY_CREATE_ERROR,
    success: ACTIONS.COLONY_CREATE_SUCCESS,
  },
});

export const createColonyLabel = createTxActionCreator<{
  colonyName: string,
  orbitDBPath: string,
}>({
  context: COLONY_CONTEXT,
  methodName: 'registerColonyLabel',
  lifecycle: {
    error: ACTIONS.COLONY_CREATE_LABEL_ERROR,
    success: ACTIONS.COLONY_CREATE_LABEL_SUCCESS,
  },
});

export const fetchColony = (ensName: ENSName) => ({
  type: ACTIONS.COLONY_FETCH,
  meta: { keyPath: [ensName] },
});

export const fetchColonyAvatar = (hash: string) => ({
  type: ACTIONS.COLONY_AVATAR_FETCH,
  meta: { keyPath: [hash] },
});

export const fetchColonyENSName = (colonyAddress: string) => ({
  type: ACTIONS.COLONY_ENS_NAME_FETCH,
  meta: { keyPath: [colonyAddress] },
});

export const fetchColonyTransactions = (colonyENSName: ENSName) => ({
  type: ACTIONS.COLONY_FETCH_TRANSACTIONS,
  meta: { keyPath: [colonyENSName] },
});

export const fetchColonyUnclaimedTransactions = (colonyENSName: ENSName) => ({
  type: ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
  meta: { keyPath: [colonyENSName] },
});

export const claimColonyToken = (ensName: ENSName, tokenAddress: string) => ({
  type: ACTIONS.COLONY_CLAIM_TOKEN,
  payload: { ensName, tokenAddress },
});

export const claimColonyTokenTransaction = createTxActionCreator<{
  token: string,
}>({
  context: COLONY_CONTEXT,
  methodName: 'claimColonyFunds',
  lifecycle: {
    error: ACTIONS.COLONY_CLAIM_TOKEN_ERROR,
    eventDataReceived: ACTIONS.COLONY_CLAIM_TOKEN_SUCCESS,
  },
});
