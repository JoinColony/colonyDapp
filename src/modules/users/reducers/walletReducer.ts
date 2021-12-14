import { WalletRecord, Wallet } from '~immutable/index';

import { ReducerType, ActionTypes } from '~redux/index';

const walletReducer: ReducerType<WalletRecord> = (state = Wallet(), action) => {
  switch (action.type) {
    case ActionTypes.WALLET_CREATE_SUCCESS: {
      const { walletType } = action.payload;
      return state.set('walletType', walletType);
    }
    case ActionTypes.USER_CONNECTED: {
      const { isUserConnected } = action.payload;
      return state.set('isUserConnected', isUserConnected);
    }
    default:
      return state;
  }
};

export default walletReducer;
