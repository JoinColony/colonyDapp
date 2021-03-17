import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import ProgressBar from '~core/ProgressBar';

import styles from './TotalStakeWidget.css';

const displayName = 'TotalStakeWidget';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.title',
    defaultMessage: 'Stake',
  },
  stakeProgress: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.stakeProgress',
    defaultMessage: '20% of 100.00 CLNY',
  },
  userStake: {
    id: 'dashboard.ActionsPage.TotalStakeWidget.userStake',
    defaultMessage: 'You staked 20% of this motion (20.000 CLNY).',
  },
});

const TotalStakeWidget = () => {
  return (
    <div>
      <div className={styles.widgetHeading}>
        <Heading
          appearance={{
            theme: 'dark',
            size: 'small',
            weight: 'bold',
            margin: 'none',
          }}
          text={MSG.title}
        />
        <span className={styles.stakeProgress}>
          <FormattedMessage {...MSG.stakeProgress} />
        </span>
      </div>
      <ProgressBar value={20} max={100} />
      <p className={styles.userStake}>
        <FormattedMessage {...MSG.userStake} />
      </p>
    </div>
  );
};

TotalStakeWidget.displayName = displayName;

export default TotalStakeWidget;
