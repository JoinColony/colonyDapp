/* @flow */

import { Map as ImmutableMap, List } from 'immutable';

import {
  COLONY_FETCH_TRANSACTIONS,
  COLONY_FETCH_TRANSACTIONS_SUCCESS,
} from '../actionTypes';

import { ContractTransaction, Data } from '~immutable';
import { withDataReducer } from '~utils/reducers';

import type { Action } from '~types';
import type { DataMap } from '~immutable';

type State = DataMap<string, List<ContractTransaction>>;

const INITIAL_STATE: State = new ImmutableMap();

const colonyTransactionsReducer = (
  state: State = INITIAL_STATE,
  action: Action,
) => {
  switch (action.type) {
    case COLONY_FETCH_TRANSACTIONS_SUCCESS: {
      const { transactions, key } = action.payload;
      const record = List(transactions.map(tx => ContractTransaction(tx)));
      return state.get(key)
        ? state.setIn([key, 'record'], record)
        : state.set(key, Data({ record }));
    }
    default:
      return state;
  }
};

export default withDataReducer<string, List<ContractTransaction>>(
  COLONY_FETCH_TRANSACTIONS,
)(colonyTransactionsReducer);
