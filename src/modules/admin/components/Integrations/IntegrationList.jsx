/* @flow */
import React from 'react';

import type { IntegrationType } from '~immutable';

import CardList from '~core/CardList';

import IntegrationCard from './IntegrationCard.jsx';

import styles from './IntegrationList.css';

type ValidCols = 'auto' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type Appearance = {
  /** Number of columns the grid should contain at its widest (read: max number of columns). Should be auto, or between 1 and 9 (inclusive). Default is `auto`. */
  numCols: ValidCols,
};

type Props = {|
  appearance?: Appearance,
  integrations: Array<IntegrationType>,
|};

const IntegrationList = ({ integrations, appearance }: Props) => (
  <div className={styles.integrationCardContainer}>
    <CardList appearance={appearance}>
      {integrations.map(integration => (
        <IntegrationCard key={integration.name} integration={integration} />
      ))}
    </CardList>
  </div>
);

export default IntegrationList;
