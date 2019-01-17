/* @flow */

import type { ENSName } from '~types';

import {
  createTxActionCreator,
  COLONY_CONTEXT,
  NETWORK_CONTEXT,
} from '../../core/actionCreators';

import {
  COLONY_CREATE_ERROR,
  COLONY_CREATE_SUCCESS,
  COLONY_CREATE_LABEL_ERROR,
  COLONY_CREATE_LABEL_SUCCESS,
  COLONY_FETCH,
  COLONY_AVATAR_FETCH,
  COLONY_ADMIN_ADD_ERROR,
  COLONY_ENS_NAME_FETCH,
} from '../actionTypes';

export const createColony = createTxActionCreator<{
  tokenAddress: string,
}>({
  context: NETWORK_CONTEXT,
  methodName: 'createColony',
  lifecycle: {
    error: COLONY_CREATE_ERROR,
    success: COLONY_CREATE_SUCCESS,
  },
});

export const createColonyLabel = createTxActionCreator<{
  colonyName: string,
  orbitDBPath: string,
}>({
  context: COLONY_CONTEXT,
  methodName: 'registerColonyLabel',
  lifecycle: {
    error: COLONY_CREATE_LABEL_ERROR,
    eventDataReceived: COLONY_CREATE_LABEL_SUCCESS,
  },
});

export const addColonyAdmin = createTxActionCreator<{
  user: string,
}>({
  context: COLONY_CONTEXT,
  methodName: 'setAdminRole',
  lifecycle: {
    error: COLONY_ADMIN_ADD_ERROR,
  },
});

export const removeColonyAdmin = createTxActionCreator<{
  user: string,
}>({
  context: COLONY_CONTEXT,
  methodName: 'removeAdminRole',
  lifecycle: {
    error: COLONY_ADMIN_ADD_ERROR,
  },
});

export const fetchColony = (ensName: ENSName) => ({
  type: COLONY_FETCH,
  payload: { keyPath: [ensName] },
});

export const fetchColonyAvatar = (hash: string) => ({
  type: COLONY_AVATAR_FETCH,
  payload: { hash },
});

export const fetchColonyENSName = (colonyAddress: string) => ({
  type: COLONY_ENS_NAME_FETCH,
  payload: { colonyAddress },
});
