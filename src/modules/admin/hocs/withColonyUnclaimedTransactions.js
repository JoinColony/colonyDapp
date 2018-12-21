/* @flow */

import { connect } from 'react-redux';
import { compose, lifecycle, branch } from 'recompose';

import { fetchColonyUnclaimedTransactions } from '../actionCreators';
import { colonyUnclaimedTransactions } from '../selectors';

export default compose(
  connect(
    (state, { colony: { ensName } }) => ({
      unclaimedTransactions: colonyUnclaimedTransactions(state, ensName),
    }),
    { fetchColonyUnclaimedTransactions },
  ),
  branch(
    props => !props.transactions,
    lifecycle({
      componentDidMount() {
        const {
          colony: { ensName },
          unclaimedTransactions,
          // eslint-disable-next-line max-len
          fetchColonyUnclaimedTransactions: fetchColonyUnclaimedTransactionsActionCreator,
        } = this.props;
        if (!(unclaimedTransactions && unclaimedTransactions.size) && ensName)
          fetchColonyUnclaimedTransactionsActionCreator(ensName);
      },
    }),
  ),
);
