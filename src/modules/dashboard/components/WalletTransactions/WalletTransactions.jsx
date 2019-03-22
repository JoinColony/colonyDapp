/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import TransactionList from '~core/TransactionList';

import styles from './WalletTransactions.css';

import type { ContractTransactionType } from '~immutable';

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

type Props = {|
  transactions?: Array<ContractTransactionType>,
  isLoading?: boolean,
|};

const WalletTransactions = ({ transactions, isLoading }: Props) => (
  <div className={styles.main}>
    <TransactionList
      transactions={transactions}
      isLoading={isLoading}
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
