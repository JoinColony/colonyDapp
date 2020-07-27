import React from 'react';

import { Address } from '~types/index';
import { useColonyTransfersQuery } from '~data/index';
import { SpinnerLoader } from '~core/Preloaders';
import TransactionList from '~core/TransactionList';

import styles from './Transactions.css';

interface Props {
  colonyAddress: Address;
}

const Transactions = ({ colonyAddress }: Props) => {
  const { data: transactionsData } = useColonyTransfersQuery({
    variables: { address: colonyAddress },
  });

  return (
    <div className={styles.main}>
      <div className={styles.transactionsWrapper}>
        <div className={styles.pendingTransactionsWrapper}>
          {transactionsData ? (
            <TransactionList
              linkToEtherscan={false}
              transactions={transactionsData.colony.unclaimedTransfers}
            />
          ) : (
            <SpinnerLoader />
          )}
        </div>
        <div className={styles.historyTransactionsWrapper}>
          {transactionsData ? (
            <TransactionList
              linkToEtherscan
              transactions={transactionsData.colony.transfers}
            />
          ) : (
            <SpinnerLoader />
          )}
        </div>
      </div>
    </div>
  );
};

Transactions.displayName = 'admin.Transactions';

export default Transactions;
