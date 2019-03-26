/* @flow */

import compose from 'recompose/compose';
import { connect } from 'react-redux';

import type { ENSName } from '~types';
import type { RootStateRecord } from '~immutable';

import {
  colonyTransactionsSelector,
  colonyUnclaimedTransactionsSelector,
} from '../selectors';
import {
  fetchColonyTransactions,
  fetchColonyUnclaimedTransactions,
} from '../actionCreators';
import fetchMissingColonyTransactions from './fetchMissingColonyTransactions';

const withColonyTransactions = compose(
  connect(
    (state: RootStateRecord, { ensName }: { ensName: ENSName }) => ({
      transactions: colonyTransactionsSelector(state, ensName),
      unclaimedTransactions: colonyUnclaimedTransactionsSelector(
        state,
        ensName,
      ),
    }),
    {
      fetchColonyTransactions,
      fetchColonyUnclaimedTransactions,
    },
  ),
  fetchMissingColonyTransactions,
);

export default withColonyTransactions;
