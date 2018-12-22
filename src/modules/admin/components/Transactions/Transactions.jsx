/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { List } from 'immutable';

import Heading from '~core/Heading';
import TransactionList from '~core/TransactionList';

import type { Address, ENSName } from '~types';

import styles from './Transactions.css';

import type { ColonyRecord, ContractTransactionRecord } from '~immutable';

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
  transactions: List<ContractTransactionRecord>,
  unclaimedTransactions: List<ContractTransactionRecord>,
  claimColonyToken: (colonyENSName: ENSName, tokenAddress: Address) => any,
};

const Transactions = ({
  colony: { address: colonyAddress, ensName: colonyENSName },
  transactions,
  unclaimedTransactions,
  claimColonyToken,
}: Props) => (
  <div className={styles.main}>
    <div className={styles.titleContainer}>
      <Heading
        appearance={{ size: 'medium', margin: 'none' }}
        text={MSG.transactionsTitle}
      />
    </div>
    <div className={styles.transactionsWrapper}>
      {unclaimedTransactions && unclaimedTransactions.size ? (
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
      ) : null}
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
