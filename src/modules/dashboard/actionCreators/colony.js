/* @flow */

import {
  CREATE_COLONY,
  CREATE_COLONY_ERROR,
  CREATE_COLONY_SUCCESS,
  CREATE_TOKEN,
  CREATE_TOKEN_ERROR,
  CREATE_TOKEN_SUCCESS,
} from '../actionTypes';

// TODO later; supply tx options
export const createToken = (name: string, symbol: string) => ({
  type: CREATE_TOKEN,
  payload: {
    params: { name, symbol },
  },
});

// TODO later; supply tx options
export const createColony = (tokenAddress: string) => ({
  type: CREATE_COLONY,
  payload: {
    params: { tokenAddress },
  },
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
