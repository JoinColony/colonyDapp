/* @flow */

import { ACTIONS } from '~redux';

import { NETWORK_CONTEXT } from '../../lib/ColonyManager/constants';
import { createTxActionCreator } from './transactions';

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
