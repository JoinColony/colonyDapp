/* @flow */

import React from 'react';

import TransactionList from '../TransactionList';

import styles from './Transactions.css';

const displayName: string = 'admin.Transactions';

const Transactions = () => (
  <div className={styles.main}>
    Transactions content
    <TransactionList />
  </div>
);

Transactions.displayName = displayName;

export default Transactions;
