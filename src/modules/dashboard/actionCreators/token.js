/* @flow */

import {
  createTxActionCreator,
  NETWORK_CONTEXT,
} from '../../core/actionCreators';

import { TOKEN_CREATE_ERROR, TOKEN_CREATE_SUCCESS } from '../actionTypes';

// eslint-disable-next-line import/prefer-default-export
export const createToken = createTxActionCreator<{
  name: string,
  symbol: string,
}>({
  context: NETWORK_CONTEXT,
  methodName: 'createToken',
  lifecycle: {
    error: TOKEN_CREATE_ERROR,
    success: TOKEN_CREATE_SUCCESS,
  },
});
