/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import Card from '~core/Card';
import Link from '~core/Link';

/*
 * @NOTE This is just temporary and should be replaced with a dynamic route
 * coming from the transaction object
 */
import { DASHBOARD_ROUTE } from '~routes';

import styles from './GasStationCard.css';

const MSG = defineMessages({
  transactionTitleSample: {
    id: 'dashboard.GasStation.GasStationCard.transactionTitleSample',
    defaultMessage: 'Create Task',
  },
  transactionDescriptionSample: {
    id: 'dashboard.GasStation.GasStationCard.transactionDescriptionSample',
    defaultMessage: 'The Meta Colony / #Javascript / Github Integration',
  },
});

const displayName = 'dashboard.GasStation.GasStationCard';

const GasStationCard = () => (
  <Card className={styles.card}>
    <div className={styles.description}>
      <Heading
        appearance={{ theme: 'dark', size: 'normal', margin: 'none' }}
        text={MSG.transactionTitleSample}
      />
      <Link
        className={styles.transactionLink}
        text={MSG.transactionDescriptionSample}
        to={DASHBOARD_ROUTE}
      />
    </div>
    <div className={styles.status}>
      <span className={styles.counter}>3</span>
    </div>
  </Card>
);

GasStationCard.displayName = displayName;

export default GasStationCard;
