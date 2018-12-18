/* @flow */

import { connect } from 'react-redux';
import { compose, lifecycle, branch, mapProps } from 'recompose';

import type { TransactionType } from '~types';
import type { ColonyTransactionRecord } from '~immutable';

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
  branch(
    props => !!props.transactions,
    mapProps(props => ({
      ...props,
      transactions: props.transactions.map(
        (colonyTx: ColonyTransactionRecord, i) =>
          ({
            amount: colonyTx.amount,
            colonyENSName: props.colony.ensName,
            date: colonyTx.date,
            from: colonyTx.from,
            nonce: i,
            taskId: colonyTx.taskId,
            to: colonyTx.to,
            tokenAddress: colonyTx.token,
            userAddress: colonyTx.to,
            incoming: colonyTx.incoming,
            hash: colonyTx.transactionHash,
          }: TransactionType),
      ),
    })),
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
  ),
)(Transactions);
