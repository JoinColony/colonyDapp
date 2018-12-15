/* @flow */

import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import { fetchColonyTransactions } from '../../actionCreators';
import { colonyTransactions } from '../../selectors';

import Transactions from './Transactions.jsx';

export default compose(
  connect(
    (state, { colony: { ensName } }) => ({
      transactions: colonyTransactions(state, ensName),
    }),
    { fetchColonyTransactions },
  ),
  lifecycle({
    componentDidMount() {
      const {
        colony,
        transactions,
        fetchColonyTransactions: fetchColonyTransactionsActionCreator,
      } = this.props;
      if (!(transactions && transactions.length) && colony.ensName)
        fetchColonyTransactionsActionCreator(colony.ensName);
    },
  }),
)(Transactions);
