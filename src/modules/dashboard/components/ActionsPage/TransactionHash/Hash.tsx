import React from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';

import styles from './TransactionHash.css';

const MSG = defineMessages({
  fallbackTitle: {
    id: 'dashboard.ActionsPage.TransactionHash.Hash.fallbackTitle',
    defaultMessage: 'Transaction hash',
  },
});

const displayName = 'dashboard.ActionsPage.TransactionHash.Hash';

interface Props {
  transactionHash: string;
  title?: MessageDescriptor;
}

const Hash = ({ transactionHash, title = MSG.fallbackTitle }: Props) => (
  <>
    <p className={styles.title}>
      <FormattedMessage {...title} />
    </p>
    <div className={styles.transactionHash}>{transactionHash}</div>
  </>
);

Hash.displayName = displayName;

export default Hash;
