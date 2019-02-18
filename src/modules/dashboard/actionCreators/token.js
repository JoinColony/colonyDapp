/* @flow */

import { ACTIONS } from '~redux';

import {
  createTxActionCreator,
  NETWORK_CONTEXT,
} from '../../core/actionCreators';

// eslint-disable-next-line import/prefer-default-export
export const createToken = createTxActionCreator<{
  name: string,
  symbol: string,
}>({
  context: NETWORK_CONTEXT,
  methodName: 'createToken',
  lifecycle: {
    error: ACTIONS.TOKEN_CREATE_ERROR,
    receiptReceived: ACTIONS.TOKEN_CREATE_SUCCESS,
  },
});
