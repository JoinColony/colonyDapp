/* @flow */

import type { SendOptions } from '@colony/colony-js-client';

import { createNetworkTransaction } from '../../core/actionCreators';

import {
  COLONY_CREATE_ERROR,
  COLONY_CREATE_SUCCESS,
  COLONY_CREATE_LABEL_ERROR,
  COLONY_CREATE_LABEL_SUCCESS,
  TOKEN_CREATE_ERROR,
  TOKEN_CREATE_SUCCESS,
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

export const createToken = (
  params: { name: string, symbol: string },
  options?: SendOptions,
) =>
  createNetworkTransaction({
    params,
    options,
    methodName: 'createToken',
    lifecycle: {
      error: TOKEN_CREATE_ERROR,
      success: TOKEN_CREATE_SUCCESS,
    },
  });

export const createColonyLabel = (
  params: {
    colonyName: string,
    orbitDBPath: string,
  },
  options?: SendOptions,
) =>
  createNetworkTransaction({
    params,
    options,
    methodName: 'registerColonyLabel',
    lifecycle: {
      error: COLONY_CREATE_LABEL_ERROR,
      success: COLONY_CREATE_LABEL_SUCCESS,
    },
  });
