import { WalletRecord, Wallet } from '~immutable/index';

import { ReducerType, ActionTypes } from '~redux/index';

const walletReducer: ReducerType<WalletRecord> = (state = Wallet(), action) => {
  switch (action.type) {
    case ActionTypes.WALLET_FETCH_ACCOUNTS:
      return state.set('isLoading', true);
    case ActionTypes.WALLET_FETCH_ACCOUNTS_ERROR:
      return state.set('isLoading', false);
    case ActionTypes.WALLET_FETCH_ACCOUNTS_SUCCESS: {
      const { allAddresses } = action.payload;
      return state.merge({
        availableAddresses: allAddresses,
        isLoading: false,
      });
    }
    case ActionTypes.WALLET_CREATE_SUCCESS: {
      const { walletType } = action.payload;
      return state.set('walletType', walletType);
    }
    default:
      return state;
  }
};

export default walletReducer;
