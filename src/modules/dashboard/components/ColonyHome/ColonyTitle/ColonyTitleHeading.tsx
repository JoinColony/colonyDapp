import React from 'react';
import { defineMessages } from 'react-intl';

import { Colony } from '~data/index';
import Heading from '~core/Heading';

import styles from './ColonyTitle.css';

const MSG = defineMessages({
  fallbackColonyName: {
    id: 'dashboard.ColonyHome.ColonyTitleHeading.fallbackColonyName',
    defaultMessage: 'Unknown Colony',
  },
});

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.ColonyHome.ColonyTitleHeading';

const ColonyTitleHeading = ({
  colony: { displayName: colonyDisplayName, colonyName },
}: Props) => {
  return (
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
  );
};

ColonyTitleHeading.displayName = displayName;

export default ColonyTitleHeading;
