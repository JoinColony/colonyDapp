import React from 'react';
import { defineMessages } from 'react-intl';

import { Colony } from '~data/index';
import Heading from '~core/Heading';
import ColonySubscription from '../ColonySubscription';

import styles from './ColonyTitle.css';

const MSG = defineMessages({
  fallbackColonyName: {
    id: 'dashboard.ColonyHome.ColonyTitle.fallbackColonyName',
    defaultMessage: 'Unknown Colony',
  },
});

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.ColonyHome.ColonyTitle';

const ColonyTitle = ({
  colony: { displayName: colonyDisplayName, colonyName },
  colony,
}: Props) => {
  return (
    <div className={styles.main}>
      <div className={styles.wrapper}>
        <div className={styles.colonyTitle}>
          <Heading
            appearance={{
              size: 'medium',
              weight: 'medium',
              margin: 'none',
            }}
            text={colonyDisplayName || colonyName || MSG.fallbackColonyName}
            data-test="colonyTitle"
          />
        </div>
        <div>
          <ColonySubscription colony={colony} />
        </div>
      </div>
    </div>
  );
};

ColonyTitle.displayName = displayName;

export default ColonyTitle;
