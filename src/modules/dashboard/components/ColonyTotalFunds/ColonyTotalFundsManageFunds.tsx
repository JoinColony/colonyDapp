import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Icon from '~core/Icon';
import Link from '~core/Link';
import { Colony } from '~data/index';

import styles from './ColonyTotalFunds.css';

const MSG = defineMessages({
  manageFundsLink: {
    id: 'dashboard.ColonyTotalFundsManageFunds.manageFundsLink',
    defaultMessage: 'Manage Funds',
  },
});

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.ColonyTotalFundsManageFunds';

const ColonyTotalFunds = ({ colony: { colonyName } }: Props) => {
  return (
    <Link
      className={styles.manageFundsLink}
      to={`/colony/${colonyName}/funds`}
      data-test="manageFunds"
    >
      <Icon
        className={styles.rightArrowDisplay}
        name="arrow-right"
        appearance={{ size: 'small' }}
        title={MSG.manageFundsLink}
      />
      <FormattedMessage {...MSG.manageFundsLink} />
    </Link>
  );
};

ColonyTotalFunds.displayName = displayName;

export default ColonyTotalFunds;
