/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

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
  colonies?: Array<string>,
|};

const displayName = 'ColonyGrid';

const ColonyGrid = ({ colonies = [] }: Props) => (
  <div className={styles.main}>
    <div className={styles.sectionTitle}>
      <Heading text={MSG.title} appearance={{ size: 'medium' }} />
    </div>
    <div className={styles.colonyGrid}>
      {colonies.map(address => (
        <div className={styles.colonyGridItem} key={address}>
          <ColonyGridItem address={address} />
        </div>
      ))}
    </div>
  </div>
);

ColonyGrid.displayName = displayName;

export default ColonyGrid;
