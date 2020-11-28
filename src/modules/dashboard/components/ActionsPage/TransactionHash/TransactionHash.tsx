import React from 'react';

import TransactionMeta from '../TransactionMeta';
import TransactionStatus from '../TransactionStatus';
import Hash from './Hash';

import { STATUS } from '../types';

import styles from './TransactionHash.css';

const displayName = 'dashboard.ActionsPage.TransactionHash';

interface Props {
  transactionHash: string;
}

const TransactionHash = ({ transactionHash }: Props) => (
  <div className={styles.main}>
    <div className={styles.status}>
      <TransactionStatus status={STATUS.Succeeded} />
    </div>
    <div className={styles.transaction}>
      <Hash transactionHash={transactionHash} />
      <TransactionMeta
        transactionHash={transactionHash}
        createdAt={new Date()}
      />
    </div>
  </div>
);

TransactionHash.displayName = displayName;

export default TransactionHash;
