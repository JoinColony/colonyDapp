/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { Address } from '~types';

import Heading from '~core/Heading';

import ColonyGridItem from './ColonyGridItem.jsx';

import styles from './ColonyGrid.css';

const MSG = defineMessages({
  title: {
    id: 'ColonyGrid.title',
    defaultMessage: 'Colonies',
  },
});

type Props = {|
  /** List of Colony addresses */
  colonyAddresses?: Address[],
|};

const displayName = 'ColonyGrid';

const ColonyGrid = ({ colonyAddresses = [] }: Props) => (
  <div className={styles.main}>
    <div className={styles.sectionTitle}>
      <Heading text={MSG.title} appearance={{ size: 'medium' }} />
    </div>
    <div className={styles.colonyGrid}>
      {colonyAddresses.map(colonyAddress => (
        <div className={styles.colonyGridItem} key={colonyAddress}>
          <ColonyGridItem colonyAddress={colonyAddress} />
        </div>
      ))}
    </div>
  </div>
);

ColonyGrid.displayName = displayName;

export default ColonyGrid;
