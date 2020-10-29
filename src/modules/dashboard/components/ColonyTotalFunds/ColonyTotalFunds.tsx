import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Colony } from '~data/index';

import styles from './ColonyTotalFunds.css';

const MSG = defineMessages({
  totalBalance: {
    id: 'dashboard.ColonyTotalFunds.totalBalance',
    defaultMessage: 'Colony total balance',
  },
});

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.ColonyTotalFunds';

const ColonyTotalFunds = () => {
  return (
    <div className={styles.main}>
      <FormattedMessage {...MSG.totalBalance} />
    </div>
  );
};

ColonyTotalFunds.displayName = displayName;

export default ColonyTotalFunds;
