/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { COLONY_FETCH_TRANSACTIONS_SUCCESS } from '../actionTypes';

import { ColonyTransaction } from '~immutable';

import type { Action, ENSName } from '~types';

type State = ImmutableMap<ENSName, Array<ColonyTransaction>>;

const INITIAL_STATE: State = new ImmutableMap();

const coloniesReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case COLONY_FETCH_TRANSACTIONS_SUCCESS: {
      const { transactions, ensName } = action.payload;
      return state.set(ensName, transactions.map(tx => ColonyTransaction(tx)));
    }
    default:
      return state;
  }
};

export default coloniesReducer;
