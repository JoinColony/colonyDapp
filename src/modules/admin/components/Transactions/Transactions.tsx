import React from 'react';

import { Address } from '~types/index';

import { useDataFetcher } from '~utils/hooks';
import {
  colonyTransactionsFetcher,
  colonyUnclaimedTransactionsFetcher,
} from '../../fetchers';

import TransactionList from '~core/TransactionList';

import styles from './Transactions.css';

interface Props {
  colonyAddress: Address;
}

const Transactions = ({ colonyAddress }: Props) => {
  const {
    data: transactions,
    isFetching: isFetchingTransactions,
    // eslint-disable-next-line prettier/prettier
  } = useDataFetcher(
    colonyTransactionsFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const {
    data: unclaimedTransactions,
    isFetching: isFetchingUnclaimedTransactions,
  } = useDataFetcher(
    colonyUnclaimedTransactionsFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  return (
    <div className={styles.main}>
      <div className={styles.transactionsWrapper}>
        <div className={styles.pendingTransactionsWrapper}>
          <TransactionList
            isLoading={isFetchingUnclaimedTransactions}
            linkToEtherscan={false}
            transactions={unclaimedTransactions}
          />
        </div>
        <div className={styles.historyTransactionsWrapper}>
          <TransactionList
            isLoading={isFetchingTransactions}
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
