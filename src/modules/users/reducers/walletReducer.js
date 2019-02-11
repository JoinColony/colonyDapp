/* @flow */

import type { WalletRecordType } from '~immutable';

import type { Action } from '~types';
import { WalletRecord } from '~immutable';

import {
  WALLET_FETCH_ACCOUNTS,
  WALLET_FETCH_ACCOUNTS_ERROR,
  WALLET_FETCH_ACCOUNTS_SUCCESS,
} from '../actionTypes';

const walletReducer = (
  state: WalletRecordType = WalletRecord(),
  action: Action,
): WalletRecord => {
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
