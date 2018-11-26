//* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import CardList from '~core/CardList';
import Card from '~core/Card';

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
  <div className={styles.main}>
    <CardList appearance={{ numCols: '1' }}>
      <Card className={styles.card}>
        <div className={styles.description}>
          <Heading
            appearance={{ theme: 'dark', size: 'normal', margin: 'none' }}
            text={MSG.transactionTitleSample}
          />
          <p className={styles.transactionDescription}>
            <FormattedMessage {...MSG.transactionDescriptionSample} />
          </p>
        </div>
        <div className={styles.status}>
          <span className={styles.counter}>3</span>
        </div>
      </Card>
    </CardList>
  </div>
);

GasStationCard.displayName = displayName;

export default GasStationCard;
