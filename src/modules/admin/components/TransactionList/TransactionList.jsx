/* @flow */

import React from 'react';

import styles from './TransactionList.css';

const displayName: string = 'admin.TransactionList';

const TransactionList = () => (
  <div className={styles.main}>Transaction List</div>
);

TransactionList.displayName = displayName;

export default TransactionList;
