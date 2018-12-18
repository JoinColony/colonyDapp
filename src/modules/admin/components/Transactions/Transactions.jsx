/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';

import TransactionList from '~core/TransactionList';

import styles from './Transactions.css';

import type { TransactionType } from '~types';
import type { ColonyRecord } from '~immutable';

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

const displayName = 'admin.Transactions';

type Props = {
  colony: ColonyRecord,
  transactions: Array<TransactionType>,
};

/*
 * Method to call when claiming the pot
 */
// const handleClaim = (transaction: TransactionType) => console.log(transaction);

const Transactions = ({
  colony: { address: colonyAddress },
  transactions, // eslint-disable-line no-unused-vars
}: Props) => (
  <div className={styles.main}>
    <div className={styles.titleContainer}>
      <Heading
        appearance={{ size: 'medium', margin: 'none' }}
        text={MSG.transactionsTitle}
      />
    </div>
    <div className={styles.transactionsWrapper}>
      {/* {augmentedPendingTransactions && augmentedPendingTransactions.length ? (
        <div className={styles.pendingTransactionsWrapper}>
          <TransactionList
            label={MSG.pendingTransactionsTitle}
            currentAddress={colonyAddress}
            transactions={augmentedPendingTransactions}
            onClaim={handleClaim}
            linkToEtherscan={false}
          />
        </div>
      ) : null} */}
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

Transactions.displayName = displayName;

export default Transactions;
