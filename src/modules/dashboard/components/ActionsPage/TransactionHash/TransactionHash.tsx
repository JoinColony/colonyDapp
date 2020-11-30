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
}

const TransactionHash = ({
  transactionHash,
  status,
  showMeta = true,
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
          createdAt={new Date()}
          status={status}
        />
      )}
    </div>
  </div>
);

TransactionHash.displayName = displayName;

export default TransactionHash;
