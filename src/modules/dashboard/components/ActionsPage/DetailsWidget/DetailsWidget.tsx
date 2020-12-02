import React, { ReactNode } from 'react';
import { getMainClasses } from '~utils/css';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './DetailsWidget.css';

const displayName = 'dashboard.ActionsPage.DetailsWidget';

const MSG = defineMessages({
  activeTeam: {
    id: 'dashboard.ActionsPage.DetailsWidget.activeTeam',
    defaultMessage: 'Active team',
  },
  actionType: {
    id: 'dashboard.ActionsPage.DetailsWidget.actionType',
    defaultMessage: 'Action Type',
  },
  from: {
    id: 'dashboard.ActionsPage.DetailsWidget.from',
    defaultMessage: 'From',
  },
  to: {
    id: 'dashboard.ActionsPage.DetailsWidget.to',
    defaultMessage: 'To',
  },
  value: {
    id: 'dashboard.ActionsPage.DetailsWidget.value',
    defaultMessage: 'Value',
  },
});

// @TODO we need to add here all possible action types
export enum ActionTypes {
  PAYMENT = 'PAYMENT',
  TRANSFER_FUNDS = 'TRANSFER_FUNDS',
  RECORVERY_MODE = 'RECORVERY_MODE',
}

interface Props {
  activeTeam?: string;
  actionType: ActionTypes;
  from: ReactNode;
  to: ReactNode;
  amount: string;
  token: string;
}

const DetailsWidget = ({
  activeTeam,
  actionType,
  from,
  to,
  amount,
  token,
}: Props) => {
  return (
    <div>
      {activeTeam && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage
              {...MSG.activeTeam}
            />
          </div>
          <div className={styles.value}>
          </div>
        </div>
      )}
      <div className={styles.item}>
        <div className={styles.label}>
          <FormattedMessage
            {...MSG.actionType}
          />
        </div>
        <div className={styles.value}>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.label}>
          <FormattedMessage
            {...MSG.from}
          />
        </div>
        <div className={styles.value}>
          {from}
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.label}>
          <FormattedMessage
            {...MSG.to}
          />
        </div>
        <div className={styles.value}>
          {to}
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.label}>
          <FormattedMessage
            {...MSG.value}
          />
        </div>
        <div className={styles.value}>
        </div>
      </div>
    </div>
  );
};

DetailsWidget.displayName = displayName;

export default DetailsWidget;
