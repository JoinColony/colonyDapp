/* @flow */

import { WALLET_SET, WALLET_CLEARED } from '../actionTypes';

type State = {
  currentAddress?: string,
};

type Action = {
  type: string,
  payload: Object,
};

const INITIAL_STATE: State = {};

const walletReducer = (state: State = INITIAL_STATE, action: Action): State => {
  switch (action.type) {
    case WALLET_SET: {
      const { currentAddress } = action.payload;
      return {
        currentAddress,
      };
    }
    case WALLET_CLEARED: {
      return INITIAL_STATE;
    }
    default: {
      return state;
    }
  }
};

export default walletReducer;
