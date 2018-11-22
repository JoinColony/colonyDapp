/* @flow */
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Alert from '~core/Alert';
import Numeral from '~core/Numeral';

import styles from './GasStationPrice.css';

const MSG = defineMessages({
  transactionFeeLabel: {
    id: 'dashboard.GasStationPrice.transactionFeeLabel',
    defaultMessage: 'Transaction fee',
  },
  transactionSpeedLabel: {
    id: 'dashboard.GasStationPrice.transactionSpeedLabel',
    defaultMessage: 'Transaction speed',
  },
  networkCongestedWarning: {
    id: 'dashboard.GasStationPrice.networkCongestedWarning',
    defaultMessage: `The network is congested and transactions
are expensive. We recommend waiting.`,
  },
  walletPromptText: {
    id: 'dashboard.GasStationPrice.walletPromptText',
    defaultMessage: `Finish the transaction on {walletType, select,
      metamask {Metamask}
      hardware {your hardware wallet}  
    }.`,
  },
});

type Props = {
  transactionFee: number,
};

const displayName = 'GasStationPrice';

const GasStationPrice = ({ transactionFee }: Props) => (
  <div className={styles.main}>
    <div className={styles.transactionSpeedContainer}>
      <FormattedMessage {...MSG.transactionSpeedLabel} />
      {/* Transaction speed button group goes here */}
    </div>
    <div className={styles.transactionFeeContainer}>
      <FormattedMessage {...MSG.transactionFeeLabel} />
      {/* Transaction fee info goes here */}
      <Numeral value={transactionFee} />
    </div>
    <div className={styles.walletPromptContainer}>
      <Alert
        text={MSG.walletPromptText}
        textValues={{
          walletType: 'metamask',
        }}
      />
    </div>
  </div>
);

GasStationPrice.displayName = displayName;

export default GasStationPrice;
