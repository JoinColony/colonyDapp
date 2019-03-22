/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import TransactionList from '~core/TransactionList';

import styles from './Transactions.css';

import type { Address, ENSName } from '~types';
import type { ContractTransactionType, DataType } from '~immutable';

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

type Props = {|
  claimColonyToken: (ensName: ENSName, tokenAddress: Address) => any,
  ensName: string,
  transactions: ?DataType<Array<ContractTransactionType>>,
  unclaimedTransactions: ?DataType<Array<ContractTransactionType>>,
|};

const Transactions = ({
  claimColonyToken,
  ensName,
  transactions,
  unclaimedTransactions,
}: Props) => (
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
          transactions={
            (unclaimedTransactions && unclaimedTransactions.record) || undefined
          }
          isLoading={
            (unclaimedTransactions && unclaimedTransactions.isFetching) || false
          }
          onClaim={transaction => claimColonyToken(ensName, transaction.token)}
          linkToEtherscan={false}
        />
      </div>
      <div className={styles.historyTransactionsWrapper}>
        <TransactionList
          label={MSG.transactionHistoryTitle}
          transactions={(transactions && transactions.record) || undefined}
          isLoading={(transactions && transactions.isFetching) || false}
          linkToEtherscan
        />
      </div>
    </div>
  </div>
);

Transactions.displayName = 'admin.Transactions';

export default Transactions;
