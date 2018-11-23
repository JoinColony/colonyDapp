/* @flow */

import { networkTransactionCreated } from '../../core/actionCreators';

import {
  COLONY_CREATE_ERROR,
  COLONY_CREATE_SUCCESS,
  TOKEN_CREATE_ERROR,
  TOKEN_CREATE_SUCCESS,
} from '../actionTypes';

export const createColony = ({ params, ...payload }: *) =>
  networkTransactionCreated<{ tokenAddress: string }>({
    params,
    methodName: 'createColony',
    lifecycle: {
      error: COLONY_CREATE_ERROR,
      success: COLONY_CREATE_SUCCESS,
    },
    ...payload,
  });

export const createToken = ({ params, ...payload }: *) =>
  networkTransactionCreated<{ name: string, symbol: string }>({
    params,
    methodName: 'createToken',
    lifecycle: {
      error: TOKEN_CREATE_ERROR,
      success: TOKEN_CREATE_SUCCESS,
    },
    ...payload,
  });
