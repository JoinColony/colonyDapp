/* @flow */
import type { HOC } from 'recompose';

import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import { allTransactions } from '../../../core/selectors';

import GasStationPopover from './GasStationPopover.jsx';

const enhance: HOC<*, *> = compose(
  connect((state: Object) => ({
    transactions: allTransactions(state)
      .toList()
      .toArray(),
  })),
  withProps(({ transactions = [] }) => ({
    transactionCount: transactions.length,
  })),
);

export default enhance(GasStationPopover);
