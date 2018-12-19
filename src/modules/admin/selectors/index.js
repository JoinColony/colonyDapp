/* @flow */

import type { Map as ImmutableMap, List } from 'immutable';

import ns from '../namespace';

import type { ENSName } from '~types';
import type { ContractTransactionRecord } from '~immutable';

type RootState = {
  [typeof ns]: {
    transactions: ImmutableMap<ENSName, List<ContractTransactionRecord>>,
  },
};

// eslint-disable-next-line import/prefer-default-export
export const colonyTransactions = (state: RootState, ensName: ENSName) =>
  state[ns].transactions.get(ensName);
