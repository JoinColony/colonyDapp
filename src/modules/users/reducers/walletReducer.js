/* @flow */

import type { WalletRecordType } from '~immutable';

import type { ReducerType } from '~redux';

import { WalletRecord } from '~immutable';
import { ACTIONS } from '~redux';

const walletReducer: ReducerType<
  WalletRecordType,
  {|
    WALLET_FETCH_ACCOUNTS: *,
    WALLET_FETCH_ACCOUNTS_SUCCESS: *,
    WALLET_CREATE_SUCCESS: *,
  |},
> = (state = WalletRecord(), action) => {
  switch (action.type) {
    case ACTIONS.WALLET_FETCH_ACCOUNTS:
      return state.set('isLoading', true);
    case ACTIONS.WALLET_FETCH_ACCOUNTS_ERROR:
      return state.set('isLoading', false);
    case ACTIONS.WALLET_FETCH_ACCOUNTS_SUCCESS: {
      const { allAddresses } = action.payload;
      return state.merge({
        availableAddresses: allAddresses,
        isLoading: false,
      });
    }
    case ACTIONS.WALLET_CREATE_SUCCESS: {
      const { walletType } = action.payload;
      return state.set('walletType', walletType);
    }
    default:
      return state;
  }
};

export default walletReducer;
