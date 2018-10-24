/* @flow */

import { Wallet } from '../records';

import type { Action } from '~types/index';

import {
  WALLET_FETCH_ACCOUNTS,
  WALLET_FETCH_ACCOUNTS_ERROR,
  WALLET_FETCHED_ACCOUNTS,
  WALLET_SET,
  WALLET_CLEARED,
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
    case WALLET_FETCHED_ACCOUNTS: {
      const { allAddresses } = action.payload;
      return state.merge({
        availableAddresses: allAddresses,
        isLoading: false,
      });
    }
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
