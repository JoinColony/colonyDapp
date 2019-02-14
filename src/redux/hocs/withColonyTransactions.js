/* @flow */

import compose from 'recompose/compose';
import { connect } from 'react-redux';

import type { ENSName } from '~types';
import type { RootStateRecord } from '~immutable';

import {
  colonyTransactions,
  colonyUnclaimedTransactions,
} from '../selectors/admin';
import {
  fetchColonyTransactions,
  fetchColonyUnclaimedTransactions,
} from '../actionCreators';
import fetchMissingColonyTransactions from './fetchMissingColonyTransactions';

const withColonyTransactions = compose(
  connect(
    (state: RootStateRecord, { ensName }: { ensName: ENSName }) => ({
      transactions: colonyTransactions(state, ensName),
      unclaimedTransactions: colonyUnclaimedTransactions(state, ensName),
    }),
    {
      fetchColonyTransactions,
      fetchColonyUnclaimedTransactions,
    },
  ),
  fetchMissingColonyTransactions,
);

export default withColonyTransactions;
