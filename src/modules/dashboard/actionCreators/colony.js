/* @flow */

import type { SendOptions } from '@colony/colony-js-client';

import type { AddressOrENSName, ENSName } from '~types';

import {
  createNetworkTransaction,
  createColonyTransaction,
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

export const createColony = (
  params: { tokenAddress: string },
  options?: SendOptions,
) =>
  createNetworkTransaction({
    params,
    options,
    methodName: 'createColony',
    lifecycle: {
      error: COLONY_CREATE_ERROR,
      success: COLONY_CREATE_SUCCESS,
    },
  });

export const createColonyLabel = (
  identifier: AddressOrENSName,
  params: {
    colonyName: string,
    orbitDBPath: string,
  },
  options?: SendOptions,
) =>
  createColonyTransaction({
    params,
    options,
    methodName: 'registerColonyLabel',
    identifier,
    lifecycle: {
      error: COLONY_CREATE_LABEL_ERROR,
      eventDataReceived: COLONY_CREATE_LABEL_SUCCESS,
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

export const addColonyAdmin = (
  identifier: AddressOrENSName,
  params: {
    user: string,
  },
  options?: SendOptions,
) =>
  createColonyTransaction({
    params,
    options,
    methodName: 'setAdminRole',
    identifier,
    lifecycle: {
      error: COLONY_ADMIN_ADD_ERROR,
    },
  });

export const removeColonyAdmin = (
  identifier: AddressOrENSName,
  params: {
    user: string,
  },
  options?: SendOptions,
) =>
  createColonyTransaction({
    params,
    options,
    methodName: 'removeAdminRole',
    identifier,
    lifecycle: {
      error: COLONY_ADMIN_ADD_ERROR,
    },
  });

export const fetchColonyENSName = (colonyAddress: string) => ({
  type: COLONY_ENS_NAME_FETCH,
  payload: { colonyAddress },
});
