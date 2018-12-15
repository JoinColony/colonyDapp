/* @flow */

import type { Map as ImmutableMap } from 'immutable';

import ns from '../namespace';

import type { ENSName } from '~types';
import type { ColonyTransactionRecord } from '~immutable';

type RootState = {
  [typeof ns]: {
    transactions: ImmutableMap<ENSName, Array<ColonyTransactionRecord>>,
  },
};

// eslint-disable-next-line import/prefer-default-export
export const colonyTransactions = (state: RootState, ensName: ENSName) =>
  state[ns].transactions.get(ensName);
