/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import { connect } from 'react-redux';

import type { List } from 'immutable';

import Heading from '~core/Heading';
import TransactionList from '~core/TransactionList';

import type { Address, ENSName } from '~types';

import {
  fetchColonyTransactions as fetchColonyTransactionsAction,
  fetchColonyUnclaimedTransactions as fetchColonyUnclaimedTransactionsAction,
  claimColonyToken as claimColonyTokenAction,
} from '../../actionCreators';

import {
  colonyTransactions,
  colonyUnclaimedTransactions,
} from '../../selectors';

import styles from './Transactions.css';

import type { ContractTransactionRecord, DataRecord } from '~immutable';

const MSG = defineMessages({
  transactionsTitle: {
    id: 'admin.Transactions.transactionsTitle',
    defaultMessage: 'Transactions',
  },
  transactionHistoryTitle: {
    id: 'admin.Transactions.transactionHistoryTitle',
    defaultMessage: 'Transaction History',
  },
  pendingTransactionsTitle: {
    id: 'admin.Transactions.pendingTransactionsTitle',
    defaultMessage: 'Pending Transactions',
  },
});

type Props = {
  colonyAddress: string,
  colonyENSName: string,
  transactions: ?DataRecord<List<ContractTransactionRecord>>,
  unclaimedTransactions: ?DataRecord<List<ContractTransactionRecord>>,
  fetchColonyTransactions: (colonyENSName: ENSName) => any,
  fetchColonyUnclaimedTransactions: (colonyENSName: ENSName) => any,
  claimColonyToken: (colonyENSName: ENSName, tokenAddress: Address) => any,
};

class Transactions extends Component<Props> {
  displayName = 'admin.Transactions';

  componentDidMount() {
    const {
      colonyENSName,
      transactions,
      unclaimedTransactions,
      fetchColonyTransactions,
      fetchColonyUnclaimedTransactions,
    } = this.props;

    // Fetch transactions if not loaded
    if (!(transactions && transactions.size) && colonyENSName)
      fetchColonyTransactions(colonyENSName);

    // Fetch unclaimed transactions if not loaded
    if (!(unclaimedTransactions && unclaimedTransactions.size) && colonyENSName)
      fetchColonyUnclaimedTransactions(colonyENSName);
  }

  render() {
    const {
      colonyAddress,
      colonyENSName,
      transactions,
      unclaimedTransactions,
      claimColonyToken,
    } = this.props;
    return (
      <div className={styles.main}>
        <div className={styles.titleContainer}>
          <Heading
            appearance={{ size: 'medium', margin: 'none' }}
            text={MSG.transactionsTitle}
          />
        </div>
        <div className={styles.transactionsWrapper}>
          <div className={styles.pendingTransactionsWrapper}>
            <TransactionList
              label={MSG.pendingTransactionsTitle}
              currentAddress={colonyAddress}
              transactions={unclaimedTransactions}
              onClaim={transaction =>
                claimColonyToken(colonyENSName, transaction.token)
              }
              linkToEtherscan={false}
            />
          </div>
          <div className={styles.historyTransactionsWrapper}>
            <TransactionList
              label={MSG.transactionHistoryTitle}
              currentAddress={colonyAddress}
              transactions={transactions}
              linkToEtherscan
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state, { colonyENSName }) => ({
    transactions: colonyTransactions(state, colonyENSName),
    unclaimedTransactions: colonyUnclaimedTransactions(state, colonyENSName),
  }),
  {
    fetchColonyTransactions: fetchColonyTransactionsAction,
    fetchColonyUnclaimedTransactions: fetchColonyUnclaimedTransactionsAction,
    claimColonyToken: claimColonyTokenAction,
  },
)(Transactions);
