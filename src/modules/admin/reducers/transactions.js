/* @flow */

import { Map as ImmutableMap, List } from 'immutable';

import {
  COLONY_FETCH_TRANSACTIONS,
  COLONY_FETCH_TRANSACTIONS_SUCCESS,
} from '../actionTypes';

import { ContractTransaction, Data } from '~immutable';
import { withDataReducer } from '~utils/reducers';

import type { UniqueActionWithKeyPath, ENSName } from '~types';
import type { DataRecord } from '~immutable';

type State = ImmutableMap<ENSName, DataRecord<List<ContractTransaction>>>;

const INITIAL_STATE: State = new ImmutableMap();

const colonyTransactionsReducer = (
  state: State = INITIAL_STATE,
  action: UniqueActionWithKeyPath,
) => {
  switch (action.type) {
    case COLONY_FETCH_TRANSACTIONS_SUCCESS: {
      const {
        payload: transactions,
        meta: {
          keyPath: [colonyENSName],
        },
      } = action;
      const record = List(transactions.map(tx => ContractTransaction(tx)));
      return state.get(colonyENSName)
        ? state.setIn([colonyENSName, 'record'], record)
        : state.set(colonyENSName, Data({ record }));
    }
    default:
      return state;
  }
};

export default withDataReducer<ENSName, List<ContractTransaction>>(
  COLONY_FETCH_TRANSACTIONS,
)(colonyTransactionsReducer);
