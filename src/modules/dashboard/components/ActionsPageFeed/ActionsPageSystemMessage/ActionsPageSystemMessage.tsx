import React from 'react';
import { FormattedMessage } from 'react-intl';

import { TransactionMeta, TransactionStatus } from '~dashboard/ActionsPage';

import { STATUS } from '../../ActionsPage/types';
import { SystemMessage } from '../types';
import { EventValues } from '../ActionsPageFeed';

import styles from './ActionsPageSystemMessage.css';

const displayName = 'dashboard.ActionsPageFeed.ActionsPageSystemMessage';

interface Props {
  systemMessage: SystemMessage;
  values?: EventValues;
}

const ActionsPageSystemMessage = ({
  systemMessage: { name, createdAt },
  values,
}: Props) => (
  <div className={styles.main}>
    <div className={styles.wrapper}>
      <div className={styles.status}>
        <TransactionStatus status={STATUS.SystemMessage} showTooltip />
      </div>
      <div className={styles.content}>
        <div className={styles.text}>
          <FormattedMessage
            id="systemMessage.title"
            values={{ name, ...values }}
          />
        </div>
        <div className={styles.details}>
          <div className={styles.meta}>
            <TransactionMeta createdAt={createdAt} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

ActionsPageSystemMessage.displayName = displayName;

export default ActionsPageSystemMessage;
