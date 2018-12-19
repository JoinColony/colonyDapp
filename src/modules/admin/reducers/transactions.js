/* @flow */

import { Map as ImmutableMap, List } from 'immutable';

import { COLONY_FETCH_TRANSACTIONS_SUCCESS } from '../actionTypes';

import { ContractTransaction } from '~immutable';

import type { Action, ENSName } from '~types';

type State = ImmutableMap<ENSName, List<ContractTransaction>>;

const INITIAL_STATE: State = new ImmutableMap();

const colonyTransactionsReducer = (
  state: State = INITIAL_STATE,
  action: Action,
) => {
  switch (action.type) {
    case COLONY_FETCH_TRANSACTIONS_SUCCESS: {
      const { transactions, ensName } = action.payload;
      return state.set(
        ensName,
        List(transactions.map(tx => ContractTransaction(tx))),
      );
    }
    default:
      return state;
  }
};

export default colonyTransactionsReducer;
