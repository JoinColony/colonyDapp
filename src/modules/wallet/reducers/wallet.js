/* @flow */

import { SET_NEW_WALLET, CLEAR_WALLET } from '../actionTypes';
import type { SetNewWalletAction, ClearWalletAction } from '../actionTypes';

type State = {
  currentAddress?: string,
};

type Action = SetNewWalletAction | ClearWalletAction;

const INITIAL_STATE: State = {};

const walletReducer = (state: State = INITIAL_STATE, action: Action): State => {
  switch (action.type) {
    case SET_NEW_WALLET: {
      const { currentAddress } = action.payload;
      return {
        currentAddress,
      };
    }
    case CLEAR_WALLET: {
      return INITIAL_STATE;
    }
    default: {
      return state;
    }
  }
};

export default walletReducer;
