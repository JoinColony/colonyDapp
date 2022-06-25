import React from 'react';
import { defineMessages } from 'react-intl';
import { useMediaQuery } from 'react-responsive';

import { Colony } from '~data/index';
import Heading from '~core/Heading';
import ColonySubscription from '../ColonySubscription';
import ColonyAddress from './ColonyAddress';

import styles from './ColonyTitle.css';
import { query700 as query } from '~styles/queries.css';

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
  colony: { displayName: colonyDisplayName, colonyName, colonyAddress },
  colony,
}: Props) => {
  const isMobile = useMediaQuery({ query });

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
          {colonyAddress && isMobile && (
            <ColonyAddress colonyAddress={colonyAddress} />
          )}
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
