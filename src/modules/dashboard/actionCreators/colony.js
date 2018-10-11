/* @flow */

import {
  CREATE_COLONY,
  CREATE_COLONY_ERROR,
  CREATE_COLONY_SUCCESS,
  CREATE_TOKEN,
  CREATE_TOKEN_ERROR,
  CREATE_TOKEN_SUCCESS,
} from '../actionTypes';

export const createToken = (name: String, symbol: String) => ({
  type: CREATE_TOKEN,
  payload: { name, symbol },
});

export const createTokenError = (error: Object) => ({
  type: CREATE_TOKEN_ERROR,
  payload: { error },
});

export const createTokenSuccess = (
  name: String,
  symbol: String,
  address: String,
) => ({
  type: CREATE_TOKEN_SUCCESS,
  payload: { name, symbol, address },
});

export const createColony = (tokenAddress: String) => ({
  type: CREATE_COLONY,
  payload: { tokenAddress },
});

export const createColonyError = (error: Object) => ({
  type: CREATE_COLONY_ERROR,
  payload: { error },
});

export const createColonySuccess = (
  colonyId: String,
  colonyAddress: String,
) => ({
  type: CREATE_COLONY_SUCCESS,
  payload: { colonyId, colonyAddress },
});
