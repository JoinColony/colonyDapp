/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';

import TransactionList from '../TransactionList';

import styles from './Transactions.css';

/*
 * Mock transaction data
 */
import {
  mockTransactions,
  mockedColoniesAddressBook,
  mockedUsersAddressBook,
  mockedTasksList,
} from './__datamocks__/transactionMocks';

import type { TransactionType } from '~types/transaction';

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

const displayName: string = 'admin.Transactions';

/*
 * @NOTE Mock values.
 * These we most likely come from the redux store.
 */
const colonyAddress: string = '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507';
/*
 * @NOTE Mock data augmentation
 * Augment the original transaction list with user's display and username
 * Augment the original transaction list with the tasks details
 *
 * This should be done somewhere in a `reselect` maybe?
 */
const augmentedTransactions: Array<TransactionType> = [].map(
  (transaction: TransactionType): TransactionType => {
    const { to, from, nonce } = transaction;
    return Object.assign({}, transaction, {
      userDetails: mockedUsersAddressBook[to] || mockedUsersAddressBook[from],
      colonyDetails:
        mockedColoniesAddressBook[to] || mockedColoniesAddressBook[from],
      task: mockedTasksList[nonce],
    });
  },
);
const augmentedPendingTransactions = augmentedTransactions.slice(0, 4);
/*
* @NOTE Mock methods
* These are also mocks basically, since the actual ones might change
 */
/*
 * Method to call when claiming the pot
 */
const handleClaim = (transaction: TransactionType) => {
  console.log(`[${displayName}] Claimed transaction`, transaction);
};
/*
 * Method to call when clicking the *Etherscan* button
 */
const handleEtherscan = (transaction: TransactionType) => {
  console.log(`[${displayName}] Redirecting to Etherscan`, transaction);
  if (transaction && transaction.hash) {
    return global.location.assign(
      `https://rinkeby.etherscan.io/tx/${transaction.hash}`,
    );
  }
  return false;
};

const Transactions = () => (
  <div className={styles.main}>
    <div className={styles.titleContainer}>
      <Heading
        appearance={{ size: 'medium', margin: 'none' }}
        text={MSG.transactionsTitle}
      />
    </div>
    <div className={styles.transactionsWrapper}>
      {augmentedPendingTransactions && augmentedPendingTransactions.length ? (
        <div className={styles.pendingTransactionsWrapper}>
          <TransactionList
            label={MSG.pendingTransactionsTitle}
            currentColonyAddress={colonyAddress}
            transactions={augmentedPendingTransactions}
            onClaim={handleClaim}
          />
        </div>
      ) : null}
      <div className={styles.historyTransactionsWrapper}>
        <TransactionList
          label={MSG.transactionHistoryTitle}
          currentColonyAddress={colonyAddress}
          transactions={augmentedTransactions}
          onEtherscan={handleEtherscan}
        />
      </div>
    </div>
  </div>
);

Transactions.displayName = displayName;

export default Transactions;
