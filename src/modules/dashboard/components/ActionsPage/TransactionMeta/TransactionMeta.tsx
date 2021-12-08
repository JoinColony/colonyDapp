import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import TimeRelative from '~core/TimeRelative';
import TransactionLink from '~core/TransactionLink';

import { DEFAULT_NETWORK_INFO } from '~constants';
import { STATUS } from '../types';

import styles from './TransactionMeta.css';

const MSG = defineMessages({
  blockExplorer: {
    id: 'dashboard.ActionsPage.TransactionMeta.blockExplorer',
    defaultMessage: '{blockExplorerName}',
  },
  transactionStatus: {
    id: 'dashboard.ColonyHome.ColonyTitle.transactionStatus',
    defaultMessage: `Transaction {status, select,
      failed {failed}
      pending {is pending...}
      other {status is unknown}
    }`,
  },
});

const displayName = 'dashboard.ActionsPage.TransactionMeta';

interface Props {
  createdAt?: number | Date;
  transactionHash?: string;
  status?: STATUS;
}

const TransactionMeta = ({ createdAt, transactionHash, status }: Props) => (
  <ul className={styles.main}>
    {createdAt && (
      <li className={styles.items}>
        <TimeRelative
          value={new Date(Number(createdAt.toString().substr(0, 10)) * 1000)}
        />
      </li>
    )}
    {transactionHash && (
      <li className={styles.items}>
        <TransactionLink
          className={styles.blockscoutLink}
          hash={transactionHash}
          text={MSG.blockExplorer}
          textValues={{
            blockExplorerName: DEFAULT_NETWORK_INFO.blockExplorerName,
          }}
        />
      </li>
    )}
    {status && status !== STATUS.Succeeded && (
      <li className={styles.items}>
        <FormattedMessage {...MSG.transactionStatus} values={{ status }} />
      </li>
    )}
  </ul>
);

TransactionMeta.displayName = displayName;

export default TransactionMeta;
