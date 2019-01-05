/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { List } from 'immutable';

import TransactionList from '~core/TransactionList';

import styles from './WalletTransactions.css';

import type { ContractTransactionRecord, DataRecord } from '~immutable';

const MSG = defineMessages({
  transactionsEmptyTitle: {
    id: 'dashboard.WalletTransactions.transactionsEmptyTitle',
    defaultMessage: 'No Transaction History',
  },
  transactionsEmptyBody: {
    id: 'dashboard.WalletTransactions.transactionsEmptyBody',
    defaultMessage:
      // eslint-disable-next-line max-len
      'This section will keep track of the tokens you have sent, received, or earned through the Colony platform.',
  },
});

const displayName = 'dashboard.WalletTransactions';

type Props = {
  transactions: ?DataRecord<List<ContractTransactionRecord>>,
  userAddress: string,
};

const WalletTransactions = ({ transactions, userAddress }: Props) => (
  <div className={styles.main}>
    <TransactionList
      currentAddress={userAddress}
      transactions={transactions}
      linkToEtherscan
      emptyState={
        <div className={styles.transactionsEmpty}>
          <div className={styles.transactionsEmptyContent}>
            <div className={styles.transactionsEmptyTitle}>
              <FormattedMessage {...MSG.transactionsEmptyTitle} />
            </div>
            <div>
              <FormattedMessage {...MSG.transactionsEmptyBody} />
            </div>
          </div>
        </div>
      }
    />
  </div>
);

WalletTransactions.displayName = displayName;

export default WalletTransactions;
