/* @flow */

import { WALLET_SET, WALLET_CLEARED } from '../actionTypes';

import { Wallet } from '../records';

import type { Action } from '~types/index';

const INITIAL_STATE = Wallet({});

const walletReducer = (
  state: Wallet = INITIAL_STATE,
  action: Action,
): Wallet => {
  switch (action.type) {
    case WALLET_SET: {
      const { currentAddress } = action.payload;
      return state.set('currentAddress', currentAddress);
    }
    case WALLET_CLEARED:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default walletReducer;
