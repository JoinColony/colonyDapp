import React from 'react';

import TransactionMeta from '../TransactionMeta';
import TransactionStatus from '../TransactionStatus';
import Hash from './Hash';

import { getMainClasses } from '~utils/css';
import { STATUS } from '../types';

import styles from './TransactionHash.css';

const displayName = 'dashboard.ActionsPage.TransactionHash';

interface Props {
  transactionHash: string;
  status?: STATUS;
  showMeta?: boolean;
  createdAt?: number;
}

const TransactionHash = ({
  transactionHash,
  status,
  showMeta = true,
  createdAt = Date.now(),
}: Props) => (
  <div className={getMainClasses({}, styles, { showStatus: !!status })}>
    {status && (
      <div className={styles.status}>
        <TransactionStatus status={status} />
      </div>
    )}
    <div className={styles.transaction}>
      <Hash transactionHash={transactionHash} />
      {showMeta && (
        <TransactionMeta
          transactionHash={transactionHash}
          createdAt={createdAt}
          status={status}
        />
      )}
    </div>
  </div>
);

TransactionHash.displayName = displayName;

export default TransactionHash;
