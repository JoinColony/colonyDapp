/* @flow */

import React from 'react';
import BN from 'bn.js';
import { defineMessages } from 'react-intl';
import { bnLessThan } from '~utils/numbers';
import { fromWei } from 'ethjs-unit';

import Alert from '~core/Alert';

import styles from './GasStationFooter.css';

const MSG = defineMessages({
  insufficientFundsNotification: {
    id: 'users.GasStation.GasStationFooter.insufficientFundsNotification',
    defaultMessage: `You do not have enough funds to complete this transaction.
      Add more ETH to cover the transaction fee.`,
  },
});

type Props = {|
  balance: BN,
|};

const displayName = 'users.GasStation.GasStationFooter';

const isBalanceLessThanTxFee = balance => {
  /* this is checking if the user can afford the transaction fee */
  const currentFeeInWei = localStorage.getItem('currentTransactionFee') || 0;
  const currentFeeinEth = fromWei(currentFeeInWei, 'ether');
  return bnLessThan(balance, currentFeeinEth);
};

const GasStationFooter = ({ balance }: Props) => (
  <div>
    {isBalanceLessThanTxFee(balance) && (
      <div className={styles.main}>
        <div className={styles.notificationContainer}>
          <div className={styles.notification}>
            <Alert
              appearance={{ theme: 'danger', size: 'small' }}
              text={MSG.insufficientFundsNotification}
            />
          </div>
        </div>
      </div>
    )}
  </div>
);

GasStationFooter.displayName = displayName;

export default GasStationFooter;
