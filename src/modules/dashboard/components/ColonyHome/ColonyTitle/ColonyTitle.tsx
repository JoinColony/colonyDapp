import React from 'react';
import { defineMessages } from 'react-intl';

import { Colony } from '~data/index';
import Heading from '~core/Heading';
import MaskedAddress from '~core/MaskedAddress';

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
  colony: { displayName: colonyDisplayName, colonyName, colonyAddress },
}: Props) => {
  return (
    <div className={styles.main}>
      <div className={styles.colonyTitle}>
        <Heading
          appearance={{
            size: 'medium',
            weight: 'thin',
            margin: 'none',
          }}
          text={colonyDisplayName || colonyName || MSG.fallbackColonyName}
        />
      </div>
      <div className={styles.colonyAddress}>
        <MaskedAddress address={colonyAddress} />
      </div>
    </div>
  );
};

ColonyTitle.displayName = displayName;

export default ColonyTitle;
