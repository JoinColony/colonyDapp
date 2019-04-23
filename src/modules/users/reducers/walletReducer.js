/* @flow */

import type { WalletRecordType } from '~immutable';

import type { ReducerType } from '~redux';

import { WalletRecord } from '~immutable';
import { ACTIONS } from '~redux';

const walletReducer: ReducerType<
  WalletRecordType,
  {|
    CURRENT_USER_CREATE: *,
    WALLET_FETCH_ACCOUNTS: *,
    WALLET_FETCH_ACCOUNTS_ERROR: *,
    WALLET_FETCH_ACCOUNTS_SUCCESS: *,
  |},
> = (state = WalletRecord(), action) => {
  switch (action.type) {
    case ACTIONS.CURRENT_USER_CREATE:
      return state.set('currentAddress', action.payload.walletAddress);
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
    default:
      return state;
  }
};

export default walletReducer;
