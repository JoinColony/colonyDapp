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
  payload: { ensName },
});

export const fetchColonyAvatar = (hash: string) => ({
  type: COLONY_AVATAR_FETCH,
  payload: { hash },
});
