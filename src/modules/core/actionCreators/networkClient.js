/* @flow */

import type ColonyNetworkClient from '@colony/colony-js-client';

import {
  LOAD_COLONY_NETWORK_SUCCESS,
  LOAD_COLONY_NETWORK,
  LOAD_COLONY_NETWORK_ERROR,
} from '../actionTypes';

export function loadColonyNetwork() {
  return {
    type: LOAD_COLONY_NETWORK,
  };
}

export function loadColonyNetworkError(error: Error) {
  return {
    type: LOAD_COLONY_NETWORK_ERROR,
    payload: { error },
  };
}

export function loadColonyNetworkSuccess(networkClient: ColonyNetworkClient) {
  return {
    type: LOAD_COLONY_NETWORK_SUCCESS,
    payload: { networkClient },
  };
}
