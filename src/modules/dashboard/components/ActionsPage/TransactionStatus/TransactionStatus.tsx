import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tooltip } from '~core/Popover';

import { getMainClasses } from '~utils/css';
import { STATUS } from '../types';

import styles from './TransactionStatus.css';

const MSG = defineMessages({
  transactionStatus: {
    id: 'dashboard.ColonyHome.ColonyTitle.transactionStatus',
    defaultMessage: `Transaction {status, select,
      failed {has failed}
      pending {is currently being mined}
      succeeded {succeeded}
      other {status is unknown}
    }`,
  },
});

const displayName = 'dashboard.ActionsPage.TransactionStatus';

interface Props {
  status: STATUS;
  showTooltip?: boolean;
}

const TransactionStatus = ({ status, showTooltip = true }: Props) => (
  <Tooltip
    placement="right"
    trigger={showTooltip ? 'hover' : 'disabled'}
    content={
      <div className={styles.tooltip}>
        <FormattedMessage {...MSG.transactionStatus} values={{ status }} />
      </div>
    }
  >
    <div className={styles.main}>
      <span className={getMainClasses({ theme: status }, styles)} />
    </div>
  </Tooltip>
);

TransactionStatus.displayName = displayName;

export default TransactionStatus;
