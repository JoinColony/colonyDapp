/* @flow */

import { connect } from 'react-redux';
import { compose, lifecycle, branch } from 'recompose';

import { fetchColonyTransactions } from '../actionCreators';
import { colonyTransactions } from '../selectors';

export default compose(
  connect(
    (state, { colony: { ensName } }) => ({
      transactions: colonyTransactions(state, ensName),
    }),
    { fetchColonyTransactions },
  ),
  branch(
    props => !props.transactions,
    lifecycle({
      componentDidMount() {
        const {
          colony: { ensName },
          transactions,
          fetchColonyTransactions: fetchColonyTransactionsActionCreator,
        } = this.props;
        if (!(transactions && transactions.size) && ensName)
          fetchColonyTransactionsActionCreator(ensName);
      },
    }),
  ),
);
