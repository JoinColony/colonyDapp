/* @flow */

import {
  CREATE_TOKEN,
  TOKEN_CREATED,
  CREATE_COLONY,
  COLONY_CREATED,
} from './constants';

export const createToken = (name: String, symbol: String) => ({
  type: CREATE_TOKEN,
  payload: { name, symbol },
});

export const tokenCreated = (
  name: String,
  symbol: String,
  tokenAddress: String,
) => ({
  type: TOKEN_CREATED,
  payload: { name, symbol, tokenAddress },
});

export const createColony = (tokenAddress: String) => ({
  type: CREATE_COLONY,
  payload: { tokenAddress },
});

export const colonyCreated = (colonyId: String, colonyAddress: String) => ({
  type: COLONY_CREATED,
  payload: { colonyId, colonyAddress },
});
