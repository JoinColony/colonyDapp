/* @flow */

import type { ENSName } from '~types';

import { ACTIONS } from '~redux';

import {
  createTxActionCreator,
  COLONY_CONTEXT,
  NETWORK_CONTEXT,
} from '../../core/actionCreators';

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
  payload: {},
});

export const fetchColonyAvatar = (hash: string) => ({
  type: ACTIONS.COLONY_AVATAR_FETCH,
  meta: { keyPath: [hash] },
  payload: {},
});

export const fetchColonyENSName = (colonyAddress: string) => ({
  type: ACTIONS.COLONY_ENS_NAME_FETCH,
  meta: { keyPath: [colonyAddress] },
  payload: {},
});
