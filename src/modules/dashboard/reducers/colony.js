/* @flow */

import {
  CREATE_COLONY_ERROR,
  CREATE_COLONY_SUCCESS,
  CREATE_TOKEN_ERROR,
  CREATE_TOKEN_SUCCESS,
} from '../actionTypes';

type State = {
  createColony: {
    colonyId?: number,
    colonyAddress?: string,
    error?: Object,
  },
  createToken: {
    tokenAddress?: string,
    error?: Object,
  },
};

const INITIAL_STATE: State = {
  createColony: {},
  createToken: {},
};

const colonyReducer = (
  state: State = INITIAL_STATE,
  { type, payload = {} }: Object,
): State => {
  switch (type) {
    case CREATE_TOKEN_SUCCESS: {
      const { tokenAddress } = payload;
      return {
        ...state,
        createToken: { tokenAddress },
      };
    }
    case CREATE_TOKEN_ERROR: {
      const { error } = payload;
      return {
        ...state,
        createToken: { error },
      };
    }
    case CREATE_COLONY_SUCCESS: {
      const {
        eventData: { colonyAddress, colonyId },
      } = payload;
      return {
        ...state,
        createColony: { colonyAddress, colonyId },
      };
    }
    case CREATE_COLONY_ERROR: {
      const { error } = payload;
      return {
        ...state,
        createColony: { error },
      };
    }
    default:
      return state;
  }
};

export default colonyReducer;
