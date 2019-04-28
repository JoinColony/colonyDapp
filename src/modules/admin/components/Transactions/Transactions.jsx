/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { Address } from '~types';
import type { ContractTransactionType } from '~immutable';

import { useDataFetcher } from '~utils/hooks';
import {
  colonyTransactionsFetcher,
  colonyUnclaimedTransactionsFetcher,
} from '../../fetchers';

import Heading from '~core/Heading';
import TransactionList from '~core/TransactionList';

import styles from './Transactions.css';

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
  colonyAddress: Address,
|};

const Transactions = ({ colonyAddress }: Props) => {
  const {
    data: transactions,
    isFetching: isFetchingTransactions,
  } = useDataFetcher<ContractTransactionType[]>(
    colonyTransactionsFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const {
    data: unclaimedTransactions,
    isFetching: isFetchingUnclaimedTransactions,
  } = useDataFetcher<ContractTransactionType[]>(
    colonyUnclaimedTransactionsFetcher,
    [colonyAddress],
    [colonyAddress],
  );

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
            isLoading={isFetchingUnclaimedTransactions}
            label={MSG.pendingTransactionsTitle}
            linkToEtherscan={false}
            transactions={unclaimedTransactions}
          />
        </div>
        <div className={styles.historyTransactionsWrapper}>
          <TransactionList
            isLoading={isFetchingTransactions}
            label={MSG.transactionHistoryTitle}
            linkToEtherscan
            transactions={transactions}
          />
        </div>
      </div>
    </div>
  );
};

Transactions.displayName = 'admin.Transactions';

export default Transactions;
