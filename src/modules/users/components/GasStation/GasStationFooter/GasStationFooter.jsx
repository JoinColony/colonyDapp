/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';
import { bnLessThan } from '~utils/numbers';

import Alert from '~core/Alert';

import styles from './GasStationFooter.css';

const MSG = defineMessages({
  insufficientFundsNotification: {
    id: 'users.GasStation.GasStationFooter.insufficientFundsNotification',
    defaultMessage: `You do not have enough funds to complete this transaction.
      Add more ETH to cover the transaction fee.`,
  },
});

type Props = {
  balance: number,
};

const displayName = 'users.GasStation.GasStationFooter';

const checkFunds = (value, balance) => bnLessThan(value, balance);

const GasStationFooter = ({ balance }: Props) => (
  <div className={styles.main}>
    {balance && (
      <div className={styles.notificationContainer}>
        <div className={styles.notification}>
          <Alert
            appearance={{ theme: 'danger', size: 'small' }}
            text={MSG.insufficientFundsNotification}
          />
        </div>
      </div>
    )}
  </div>
);

GasStationFooter.displayName = displayName;

export default GasStationFooter;
