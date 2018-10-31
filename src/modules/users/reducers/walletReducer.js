/* @flow */

import { Wallet } from '../records';

import type { Action } from '~types/index';

import {
  WALLET_FETCH_ACCOUNTS,
  WALLET_FETCH_ACCOUNTS_ERROR,
  WALLET_FETCH_ACCOUNTS_SUCCESS,
} from '../actionTypes';

const INITIAL_STATE = Wallet({});

const walletReducer = (
  state: Wallet = INITIAL_STATE,
  action: Action,
): Wallet => {
  switch (action.type) {
    case WALLET_FETCH_ACCOUNTS:
      return state.set('isLoading', true);
    case WALLET_FETCH_ACCOUNTS_ERROR:
      return state.set('isLoading', false);
    case WALLET_FETCH_ACCOUNTS_SUCCESS: {
      const { allAddresses } = action.payload;
      return state.merge({
        availableAddresses: allAddresses,
        isLoading: false,
      });
    }
    default:
      return state;
  }
};

export default walletReducer;
