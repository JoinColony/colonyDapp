import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Address } from '~types/index';

import styles from './ColonySubscription.css';

const MSG = defineMessages({
  joinColony: {
    id: 'dashboard.ColonyHome.ColonySubscription.joinColony',
    defaultMessage: 'Join',
  },
  leaveColonyQuestion: {
    id: 'dashboard.ColonyHome.ColonySubscription.leaveColonyQuestion',
    defaultMessage: 'Leave?',
  },
});

interface Props {
  colonyAddress: Address;
}

const ColonySubscription = ({ colonyAddress }: Props) => {
  return (
    <div className={styles.main}>
      <button type="button" className={styles.joinColony}>
        <FormattedMessage {...MSG.joinColony} />
      </button>
    </div>
  );
};

ColonySubscription.displayName = 'dashboard.ColonyHome.ColonySubscription';

export default ColonySubscription;
